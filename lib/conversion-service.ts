import { parseString, Builder } from "xml2js"
import YAML from "yaml"

export type ConversionFormat =
  | "json"
  | "xml"
  | "yaml"
  | "csv"
  | "tsv"
  | "sql"
  | "protobuf"
  | "avro"
  | "excel"
  | "plaintext"
  | "html"
  | "parquet"
  | "markdown"
  | "morse"

export interface ConversionResult {
  success: boolean
  result: string
  error?: string
}

// Update the Morse code map to be more comprehensive
const morseCodeMap = {
  // Letters
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",

  // Numbers
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",

  // Punctuation
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "'": ".----.",
  "!": "-.-.--",
  "/": "-..-.",
  "(": "-.--.",
  ")": "-.--.-",
  "&": ".-...",
  ":": "---...",
  ";": "-.-.-.",
  "=": "-...-",
  "+": ".-.-.",
  "-": "-....-",
  _: "..--.-",
  '"': ".-..-.",
  $: "...-..-",
  "@": ".--.-.",

  // Special characters
  " ": "/", // Space is represented as a forward slash in Morse code

  // Additional characters
  Á: ".--.-",
  Ä: ".-.-",
  É: "..-..",
  Ñ: "--.--",
  Ö: "---.",
  Ü: "..--",
  "<": ".-..-",
  ">": ".-..-",
  "[": "-.--.",
  "]": "-.--.-",
  "{": "-.--.",
  "}": "-.--.-",
  "\\": "-..-.",
  "|": "-..-.",
  "^": "......",
  "*": "-..-",
  "#": "...-.-",
  "%": "-..-.-",
  "~": ".-.-.",
  "`": ".----.",
}

// Reverse the Morse code map for decoding
const reverseMorseCodeMap = Object.entries(morseCodeMap).reduce((acc, [char, code]) => {
  acc[code] = char
  return acc
}, {})

// Enhanced Morse code conversion functions

// Function to convert text to Morse code with more options
const textToMorse = (text: string, options: { wordSeparator?: string; charSeparator?: string } = {}): string => {
  const { wordSeparator = " / ", charSeparator = " " } = options

  return text
    .toUpperCase()
    .split(" ")
    .map((word) =>
      word
        .split("")
        .map((char) => morseCodeMap[char] || char)
        .join(charSeparator),
    )
    .join(wordSeparator)
}

// Function to convert Morse code to text with more options
const morseToText = (
  morse: string,
  options: { wordSeparator?: string | RegExp; charSeparator?: string | RegExp } = {},
): string => {
  const { wordSeparator = / \/ | \/ | \/\/\/ /, charSeparator = / / } = options

  return morse
    .split(wordSeparator)
    .map((word) =>
      word
        .split(charSeparator)
        .map((code) => reverseMorseCodeMap[code] || code)
        .join(""),
    )
    .join(" ")
}

// Function to validate if a string is valid Morse code
const isValidMorse = (morse: string): boolean => {
  const validChars = new Set([".", "-", "/", " "])
  return morse.split("").every((char) => validChars.has(char))
}

// Function to play Morse code audio
const playMorseAudio = (
  morse: string,
  options: { dotDuration?: number; dashDuration?: number; pauseDuration?: number } = {},
): void => {
  if (typeof window === "undefined") return // Server-side check

  const { dotDuration = 100, dashDuration = 300, pauseDuration = 100 } = options
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

  const playTone = (duration: number, time: number) => {
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.type = "sine"
    oscillator.frequency.value = 700

    oscillator.start(time)
    oscillator.stop(time + duration / 1000)
  }

  let currentTime = audioContext.currentTime

  morse.split("").forEach((char) => {
    if (char === ".") {
      playTone(dotDuration, currentTime)
      currentTime += dotDuration / 1000
    } else if (char === "-") {
      playTone(dashDuration, currentTime)
      currentTime += dashDuration / 1000
    }

    // Add pause after each character
    if (char === "." || char === "-") {
      currentTime += pauseDuration / 1000
    } else if (char === " ") {
      currentTime += (pauseDuration * 3) / 1000 // Longer pause between words
    } else if (char === "/") {
      currentTime += (pauseDuration * 7) / 1000 // Even longer pause for word separator
    }
  })
}

// Function to convert Morse code to binary
const morseToBinary = (morse: string): string => {
  return morse.replace(/\./g, "10").replace(/-/g, "1110").replace(/ /g, "00").replace(/\//g, "000000")
}

// Function to convert binary to Morse code
const binaryToMorse = (binary: string): string => {
  return binary
    .replace(/1110/g, "-")
    .replace(/10/g, ".")
    .replace(/000000/g, "/")
    .replace(/00/g, " ")
}

export const convertData = (
  input: string,
  sourceFormat: ConversionFormat,
  targetFormat: ConversionFormat,
  indentSize: number,
): Promise<ConversionResult> => {
  return new Promise((resolve) => {
    try {
      let result = ""
      const format = `${sourceFormat}-to-${targetFormat}`

      // Add Morse code conversion cases
      if (format === "plaintext-to-morse") {
        result = textToMorse(input)
      } else if (format === "morse-to-plaintext") {
        result = morseToText(input)
      } else if (format === "morse-to-json") {
        const text = morseToText(input)
        try {
          // Try to parse as JSON if it's valid JSON after conversion
          const jsonObj = JSON.parse(text)
          result = JSON.stringify(jsonObj, null, indentSize)
        } catch {
          // If not valid JSON, wrap as a JSON string
          result = JSON.stringify({ text }, null, indentSize)
        }
      } else if (format === "json-to-morse") {
        // Convert JSON to string and then to Morse
        result = textToMorse(JSON.stringify(JSON.parse(input), null, 0))
      } else if (targetFormat === "morse") {
        // For other formats to Morse, convert to string first
        let textContent = input

        if (sourceFormat === "xml" || sourceFormat === "yaml" || sourceFormat === "csv" || sourceFormat === "tsv") {
          textContent = input
        }

        result = textToMorse(textContent)
      } else if (sourceFormat === "morse" && targetFormat !== "plaintext" && targetFormat !== "json") {
        // For Morse to other formats, convert to text first
        const text = morseToText(input)
        throw new Error(
          `Direct conversion from Morse code to ${targetFormat} is not supported. Convert to Plain Text first.`,
        )
      } else if (format === "morse-to-xml") {
        const text = morseToText(input)
        try {
          // Try to parse as XML if it's valid XML after conversion
          parseString(text, (err, parsedResult) => {
            if (err) throw err
            const builder = new Builder({
              headless: true,
              renderOpts: { pretty: true, indent: " ".repeat(indentSize) },
            })
            result = builder.buildObject(parsedResult)
          })
        } catch {
          // If not valid XML, wrap as a simple XML document
          result = `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n${" ".repeat(indentSize)}<text>${text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</text>\n</root>`
        }
      } else if (format === "morse-to-yaml") {
        const text = morseToText(input)
        try {
          // Try to parse as YAML if it's valid YAML after conversion
          const yamlObj = YAML.parse(text)
          result = YAML.stringify(yamlObj, { indent: indentSize })
        } catch {
          // If not valid YAML, wrap as a simple YAML document
          result = `text: "${text.replace(/"/g, '\\"')}"`
        }
      } else if (format === "morse-to-csv") {
        const text = morseToText(input)
        // Simple conversion to single-cell CSV
        result = `"text"\n"${text.replace(/"/g, '""')}"`
      } else if (format === "morse-to-tsv") {
        const text = morseToText(input)
        // Simple conversion to single-cell TSV
        result = `text\n${text}`
      } else if (format === "morse-to-sql") {
        const text = morseToText(input)
        // Create a simple SQL statement
        result = `CREATE TABLE morse_data (\n  text VARCHAR(255)\n);\n\nINSERT INTO morse_data (text) VALUES ('${text.replace(/'/g, "''")}');`
      } else if (format === "morse-to-html") {
        const text = morseToText(input)
        // Create a simple HTML document
        result = `<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <title>Morse Code Conversion</title>\n</head>\n<body>\n  <h1>Decoded Morse Code</h1>\n  <p>${text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>\n</body>\n</html>`
      } else if (format === "morse-to-markdown") {
        const text = morseToText(input)
        // Create a simple Markdown document
        result = `# Decoded Morse Code\n\n${text}`
      } else if (format === "json-to-xml") {
        const jsonObj = JSON.parse(input)
        const builder = new Builder({
          headless: true,
          renderOpts: { pretty: true, indent: " ".repeat(indentSize) },
        })
        result = builder.buildObject(jsonObj)
      } else if (format === "json-to-yaml") {
        const jsonObj = JSON.parse(input)
        result = YAML.stringify(jsonObj, { indent: indentSize })
      } else if (format === "xml-to-json") {
        parseString(input, (err, parsedResult) => {
          if (err) throw err
          result = JSON.stringify(parsedResult, null, indentSize)
        })
      } else if (format === "yaml-to-json") {
        const yamlObj = YAML.parse(input)
        result = JSON.stringify(yamlObj, null, indentSize)
      } else if (format === "json-to-csv") {
        const jsonObj = JSON.parse(input)
        if (Array.isArray(jsonObj)) {
          // Get headers from the first object
          const headers = Object.keys(jsonObj[0] || {})
          // Create CSV header row
          let csv = headers.join(",") + "\n"
          // Add data rows
          jsonObj.forEach((item) => {
            const row = headers
              .map((header) => {
                const value = item[header]
                // Handle strings with commas by wrapping in quotes
                return typeof value === "string" && value.includes(",") ? `"${value}"` : value
              })
              .join(",")
            csv += row + "\n"
          })
          result = csv
        } else {
          throw new Error("JSON must be an array of objects for CSV conversion")
        }
      } else if (format === "csv-to-json") {
        const lines = input.split("\n")
        const headers = lines[0].split(",").map((h) => h.trim())
        const jsonArray = []

        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue

          const values = lines[i].split(",")
          const obj = {}

          headers.forEach((header, index) => {
            let value = values[index] ? values[index].trim() : ""
            // Remove quotes if present
            if (value.startsWith('"') && value.endsWith('"')) {
              value = value.substring(1, value.length - 1)
            }
            obj[header] = value
          })

          jsonArray.push(obj)
        }

        result = JSON.stringify(jsonArray, null, indentSize)
      } else if (format === "csv-to-xml") {
        const lines = input.split("\n")
        const headers = lines[0].split(",").map((h) => h.trim())

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n'

        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue

          const values = lines[i].split(",")
          xml += `${" ".repeat(indentSize)}<item>\n`

          headers.forEach((header, index) => {
            let value = values[index] ? values[index].trim() : ""
            // Remove quotes if present
            if (value.startsWith('"') && value.endsWith('"')) {
              value = value.substring(1, value.length - 1)
            }
            // Sanitize XML element names (replace spaces and special chars)
            const safeHeader = header.replace(/[^a-zA-Z0-9]/g, "_")
            // Escape XML special characters in value
            const safeValue = value
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&apos;")

            xml += `${" ".repeat(indentSize * 2)}<${safeHeader}>${safeValue}</${safeHeader}>\n`
          })

          xml += `${" ".repeat(indentSize)}</item>\n`
        }

        xml += "</root>"
        result = xml
      } else if (format === "csv-to-yaml") {
        // First convert CSV to JSON, then JSON to YAML
        const lines = input.split("\n")
        const headers = lines[0].split(",").map((h) => h.trim())
        const jsonArray = []

        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue

          const values = lines[i].split(",")
          const obj = {}

          headers.forEach((header, index) => {
            let value = values[index] ? values[index].trim() : ""
            // Remove quotes if present
            if (value.startsWith('"') && value.endsWith('"')) {
              value = value.substring(1, value.length - 1)
            }
            obj[header] = value
          })

          jsonArray.push(obj)
        }

        result = YAML.stringify(jsonArray, { indent: indentSize })
      } else if (format === "csv-to-sql") {
        const lines = input.split("\n")
        const headers = lines[0].split(",").map((h) => h.trim())

        // Generate table name from the first header or use a default
        const tableName = "csv_data"

        // Create CREATE TABLE statement
        let sql = `CREATE TABLE ${tableName} (\n`
        sql += headers
          .map((header) => {
            // Sanitize column names
            const safeHeader = header.replace(/[^a-zA-Z0-9]/g, "_")
            return `  ${safeHeader} VARCHAR(255)`
          })
          .join(",\n")
        sql += "\n);\n\n"

        // Generate INSERT statements
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue

          const values = lines[i].split(",")
          const sanitizedValues = values.map((value) => {
            let sanitized = value.trim()
            // Remove quotes if present
            if (sanitized.startsWith('"') && sanitized.endsWith('"')) {
              sanitized = sanitized.substring(1, sanitized.length - 1)
            }
            // Escape single quotes for SQL
            sanitized = sanitized.replace(/'/g, "''")
            return `'${sanitized}'`
          })

          sql += `INSERT INTO ${tableName} (${headers.map((h) => h.replace(/[^a-zA-Z0-9]/g, "_")).join(", ")}) VALUES (${sanitizedValues.join(", ")});\n`
        }

        result = sql
      } else if (format === "csv-to-excel") {
        // For Excel, we'll generate a CSV that can be opened in Excel
        // This is a simplified approach since we can't generate actual Excel files in the browser
        result = input // Just return the CSV as is, since Excel can open CSV files
      } else if (format === "csv-to-protobuf") {
        const lines = input.split("\n")
        const headers = lines[0].split(",").map((h) => h.trim())

        // Generate a Protocol Buffers schema based on CSV structure
        let proto = 'syntax = "proto3";\n\n'
        proto += "package generated;\n\n"

        // Create message definition
        proto += "message CsvRow {\n"

        // Add fields based on headers
        headers.forEach((header, index) => {
          // Sanitize field names
          const safeHeader = header.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()
          proto += `  string ${safeHeader} = ${index + 1};\n`
        })

        proto += "}\n\n"

        // Add a repeated message for the entire CSV
        proto += "message CsvData {\n"
        proto += "  repeated CsvRow rows = 1;\n"
        proto += "}\n"

        result = proto
      } else if (format === "csv-to-avro") {
        const lines = input.split("\n")
        const headers = lines[0].split(",").map((h) => h.trim())

        // Create Avro schema
        const avroSchema = {
          type: "record",
          name: "CsvData",
          namespace: "com.example",
          fields: headers.map((header) => ({
            name: header.replace(/[^a-zA-Z0-9]/g, "_"),
            type: ["null", "string"],
            default: null,
          })),
        }

        result = JSON.stringify(avroSchema, null, indentSize)
      } else if (format === "csv-to-parquet") {
        // Since we can't actually generate Parquet files in the browser,
        // we'll provide a message explaining this limitation
        result = `// Parquet is a binary format that cannot be generated directly in the browser.
// Below is a representation of how the data would be structured in Parquet:

// CSV Headers: ${input.split("\n")[0]}

// Parquet uses a columnar storage format optimized for:
// - Efficient compression
// - Fast queries on specific columns
// - Handling complex nested data structures

// To convert this CSV to actual Parquet format, you would need:
// 1. A server-side implementation using libraries like Apache Arrow or Parquet-js
// 2. Or desktop tools like Apache Spark, pandas (with pyarrow), etc.

// The Parquet file would contain the same data as your CSV,
// but stored in a binary columnar format with metadata.`
      } else if (format === "csv-to-markdown") {
        const lines = input.split("\n")
        const headers = lines[0].split(",").map((h) => h.trim())

        // Create markdown table header
        let markdown = "| " + headers.join(" | ") + " |\n"
        // Add separator row
        markdown += "| " + headers.map(() => "---").join(" | ") + " |\n"

        // Add data rows
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue

          const values = lines[i].split(",")
          const sanitizedValues = values.map((value) => {
            let sanitized = value.trim()
            // Remove quotes if present
            if (sanitized.startsWith('"') && sanitized.endsWith('"')) {
              sanitized = sanitized.substring(1, sanitized.length - 1)
            }
            // Escape pipe characters in markdown
            sanitized = sanitized.replace(/\|/g, "\\|")
            return sanitized
          })

          markdown += "| " + sanitizedValues.join(" | ") + " |\n"
        }

        result = markdown
      } else if (format === "json-to-tsv") {
        const jsonObj = JSON.parse(input)
        if (Array.isArray(jsonObj)) {
          // Get headers from the first object
          const headers = Object.keys(jsonObj[0] || {})
          // Create TSV header row
          let tsv = headers.join("\t") + "\n"
          // Add data rows
          jsonObj.forEach((item) => {
            const row = headers
              .map((header) => {
                const value = item[header]
                // Handle strings with tabs by replacing them
                return typeof value === "string" ? value.replace(/\t/g, " ") : value
              })
              .join("\t")
            tsv += row + "\n"
          })
          result = tsv
        } else {
          throw new Error("JSON must be an array of objects for TSV conversion")
        }
      } else if (format === "json-to-sql") {
        const jsonObj = JSON.parse(input)
        if (Array.isArray(jsonObj) && jsonObj.length > 0) {
          // Infer table name from the first object's keys
          const tableName = "table_data"
          const columns = Object.keys(jsonObj[0])

          // Create CREATE TABLE statement
          let sql = `CREATE TABLE ${tableName} (\n`
          sql += columns.map((col) => `  ${col} VARCHAR(255)`).join(",\n")
          sql += "\n);\n\n"

          // Create INSERT statements
          jsonObj.forEach((item) => {
            const values = columns.map((col) => {
              const val = item[col]
              if (val === null || val === undefined) return "NULL"
              if (typeof val === "string") return `'${val.replace(/'/g, "''")}'`
              return val
            })

            sql += `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${values.join(", ")});\n`
          })

          result = sql
        } else {
          throw new Error("JSON must be a non-empty array of objects for SQL conversion")
        }
      } else if (format === "json-to-html") {
        const jsonObj = JSON.parse(input)
        if (Array.isArray(jsonObj) && jsonObj.length > 0) {
          // Create HTML table
          let html = "<!DOCTYPE html>\n<html>\n<head>\n"
          html += '  <meta charset="UTF-8">\n'
          html += "  <title>JSON to HTML Conversion</title>\n"
          html += "  <style>\n"
          html += "    table { border-collapse: collapse; width: 100%; }\n"
          html += "    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }\n"
          html += "    th { background-color: #f2f2f2; }\n"
          html += "    tr:nth-child(even) { background-color: #f9f9f9; }\n"
          html += "  </style>\n"
          html += "</head>\n<body>\n"

          // Table start
          html += "<table>\n  <thead>\n    <tr>\n"

          // Headers
          const columns = Object.keys(jsonObj[0])
          columns.forEach((col) => {
            html += `      <th>${col}</th>\n`
          })

          html += "    </tr>\n  </thead>\n  <tbody>\n"

          // Data rows
          jsonObj.forEach((item) => {
            html += "    <tr>\n"
            columns.forEach((col) => {
              const value = item[col] !== null && item[col] !== undefined ? item[col] : ""
              html += `      <td>${value}</td>\n`
            })
            html += "    </tr>\n"
          })

          html += "  </tbody>\n</table>\n</body>\n</html>"
          result = html
        } else if (!Array.isArray(jsonObj)) {
          // For non-array JSON, create a simple property list
          let html = "<!DOCTYPE html>\n<html>\n<head>\n"
          html += '  <meta charset="UTF-8">\n'
          html += "  <title>JSON to HTML Conversion</title>\n"
          html += "  <style>\n"
          html += "    .json-object { font-family: monospace; }\n"
          html += "    .property { margin-left: 20px; }\n"
          html += "    .key { font-weight: bold; }\n"
          html += "  </style>\n"
          html += "</head>\n<body>\n"
          html += '<div class="json-object">\n'

          // Convert object to HTML
          const renderObject = (obj, indent = 0) => {
            let htmlContent = ""
            const padding = " ".repeat(indent * 2)

            Object.entries(obj).forEach(([key, value]) => {
              htmlContent += `${padding}<div class="property"><span class="key">${key}:</span> `

              if (value === null) {
                htmlContent += "null"
              } else if (typeof value === "object") {
                htmlContent += "{\n"
                htmlContent += renderObject(value, indent + 1)
                htmlContent += `${padding}}</div>\n`
              } else {
                htmlContent += `${value}</div>\n`
              }
            })

            return htmlContent
          }

          html += renderObject(jsonObj)
          html += "</div>\n</body>\n</html>"
        } else {
          throw new Error("JSON must not be an empty array for HTML conversion")
        }
      } else if (format === "json-to-plaintext") {
        const jsonObj = JSON.parse(input)

        // Function to convert JSON to plain text with indentation
        const jsonToPlainText = (obj, indent = 0) => {
          let text = ""
          const padding = " ".repeat(indent * 2)

          if (Array.isArray(obj)) {
            obj.forEach((item, index) => {
              text += `${padding}[${index}]:\n`
              if (typeof item === "object" && item !== null) {
                text += jsonToPlainText(item, indent + 1)
              } else {
                text += `${padding}  ${item}\n`
              }
            })
          } else if (typeof obj === "object" && obj !== null) {
            Object.entries(obj).forEach(([key, value]) => {
              text += `${padding}${key}: `
              if (typeof value === "object" && value !== null) {
                text += "\n" + jsonToPlainText(value, indent + 1)
              } else {
                text += `${value}\n`
              }
            })
          }

          return text
        }

        result = jsonToPlainText(jsonObj)
      } else if (format === "json-to-protobuf") {
        const jsonObj = JSON.parse(input)

        // Generate a simple Protocol Buffers schema based on JSON structure
        let proto = 'syntax = "proto3";\n\n'
        proto += "package generated;\n\n"

        // Helper function to determine Proto type from JSON value
        const getProtoType = (value) => {
          if (value === null || value === undefined) return "string"
          if (typeof value === "string") return "string"
          if (typeof value === "number") {
            return Number.isInteger(value) ? "int32" : "double"
          }
          if (typeof value === "boolean") return "bool"
          if (Array.isArray(value)) return "repeated " + getProtoType(value[0] || "string")
          if (typeof value === "object") return value.constructor.name
          return "string" // default
        }

        // Generate message definitions
        const generateMessages = (obj, messageName = "Root") => {
          let messages = ""

          if (Array.isArray(obj) && obj.length > 0) {
            // For arrays, use the first item as a template
            return generateMessages(obj[0], messageName)
          }

          if (typeof obj === "object" && obj !== null) {
            messages += `message ${messageName} {\n`

            let fieldIndex = 1
            const nestedMessages = []

            Object.entries(obj).forEach(([key, value]) => {
              let fieldType = getProtoType(value)

              // Handle nested objects
              if (typeof value === "object" && value !== null && !Array.isArray(value)) {
                const nestedName = key.charAt(0).toUpperCase() + key.slice(1)
                fieldType = nestedName
                nestedMessages.push(generateMessages(value, nestedName))
              }

              // Handle arrays of objects
              if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object" && value[0] !== null) {
                const nestedName = key.charAt(0).toUpperCase() + key.slice(1) + "Item"
                fieldType = `repeated ${nestedName}`
                nestedMessages.push(generateMessages(value[0], nestedName))
              }

              messages += `  ${fieldType} ${key} = ${fieldIndex++};\n`
            })

            messages += "}\n\n"
            messages += nestedMessages.join("")
          }

          return messages
        }

        result = proto + generateMessages(jsonObj)
      } else if (format === "json-to-avro") {
        const jsonObj = JSON.parse(input)

        // Helper function to determine Avro type from JSON value
        const getAvroType = (value) => {
          if (value === null || value === undefined) return ["null", "string"]
          if (typeof value === "string") return "string"
          if (typeof value === "number") {
            return Number.isInteger(value) ? "int" : "double"
          }
          if (typeof value === "boolean") return "boolean"
          if (Array.isArray(value)) {
            return {
              type: "array",
              items: value.length > 0 ? getAvroType(value[0]) : "string",
            }
          }
          if (typeof value === "object") {
            return generateAvroSchema(value, value.constructor.name)
          }
          return "string" // default
        }

        // Generate Avro schema from JSON object
        const generateAvroSchema = (obj, recordName = "Root") => {
          if (Array.isArray(obj) && obj.length > 0) {
            // For arrays, use the first item as a template
            return {
              type: "array",
              items: generateAvroSchema(obj[0], recordName + "Item"),
            }
          }

          if (typeof obj === "object" && obj !== null) {
            const fields = Object.entries(obj).map(([key, value]) => ({
              name: key,
              type: getAvroType(value),
            }))

            return {
              type: "record",
              name: recordName,
              fields: fields,
            }
          }

          return "string" // default for empty objects
        }

        const avroSchema = {
          type: "record",
          name: "RootRecord",
          namespace: "com.example",
          fields: Object.entries(jsonObj).map(([key, value]) => ({
            name: key,
            type: getAvroType(value),
          })),
        }

        result = JSON.stringify(avroSchema, null, indentSize)
      } else if (format === "json-to-excel") {
        // For Excel, we'll generate a CSV that can be opened in Excel
        // This is a simplified approach since we can't generate actual Excel files in the browser
        const jsonObj = JSON.parse(input)
        if (Array.isArray(jsonObj)) {
          // Get headers from the first object
          const headers = Object.keys(jsonObj[0] || {})
          // Create CSV header row
          let csv = headers.join(",") + "\n"
          // Add data rows
          jsonObj.forEach((item) => {
            const row = headers
              .map((header) => {
                const value = item[header]
                // Handle strings with commas by wrapping in quotes
                if (typeof value === "string") {
                  // Escape quotes in the string
                  const escaped = value.replace(/"/g, '""')
                  return `"${escaped}"`
                }
                return value !== null && value !== undefined ? value : ""
              })
              .join(",")
            csv += row + "\n"
          })
          result = csv
        } else {
          throw new Error("JSON must be an array of objects for Excel conversion")
        }
      } else {
        throw new Error(`Conversion from ${sourceFormat} to ${targetFormat} is not supported yet`)
      }

      resolve({ success: true, result })
    } catch (err) {
      resolve({ success: false, result: "", error: err.message })
    }
  })
}

// Format options
export const sourceFormats = [
  { value: "json", label: "JSON" },
  { value: "xml", label: "XML" },
  { value: "yaml", label: "YAML" },
  { value: "csv", label: "CSV" },
  { value: "tsv", label: "TSV" },
  { value: "plaintext", label: "PLAIN TEXT" },
  { value: "morse", label: "MORSE CODE" },
]

// Target format mapping
export const targetFormatMap = {
  json: [
    { value: "xml", label: "XML" },
    { value: "yaml", label: "YAML" },
    { value: "csv", label: "CSV" },
    { value: "tsv", label: "TSV" },
    { value: "sql", label: "SQL" },
    { value: "protobuf", label: "PROTOBUF" },
    { value: "avro", label: "AVRO" },
    { value: "excel", label: "EXCEL" },
    { value: "plaintext", label: "PLAIN TEXT" },
    { value: "html", label: "HTML" },
    { value: "morse", label: "MORSE CODE" },
  ],
  xml: [
    { value: "json", label: "JSON" },
    { value: "morse", label: "MORSE CODE" },
  ],
  yaml: [
    { value: "json", label: "JSON" },
    { value: "morse", label: "MORSE CODE" },
  ],
  csv: [
    { value: "json", label: "JSON" },
    { value: "xml", label: "XML" },
    { value: "yaml", label: "YAML" },
    { value: "sql", label: "SQL" },
    { value: "excel", label: "EXCEL" },
    { value: "parquet", label: "PARQUET" },
    { value: "avro", label: "AVRO" },
    { value: "protobuf", label: "PROTOBUF" },
    { value: "markdown", label: "MARKDOWN" },
    { value: "morse", label: "MORSE CODE" },
  ],
  tsv: [
    { value: "json", label: "JSON" },
    { value: "morse", label: "MORSE CODE" },
  ],
  plaintext: [{ value: "morse", label: "MORSE CODE" }],
  morse: [
    { value: "plaintext", label: "PLAIN TEXT" },
    { value: "json", label: "JSON" },
    { value: "xml", label: "XML" },
    { value: "yaml", label: "YAML" },
    { value: "csv", label: "CSV" },
    { value: "tsv", label: "TSV" },
    { value: "sql", label: "SQL" },
    { value: "html", label: "HTML" },
    { value: "markdown", label: "MARKDOWN" },
  ],
}

// Update the outputs state to include morse
export const outputs = {
  json: "",
  xml: "",
  yaml: "",
  csv: "",
  tsv: "",
  sql: "",
  protobuf: "",
  avro: "",
  excel: "",
  plaintext: "",
  html: "",
  parquet: "",
  markdown: "",
  morse: "",
}

// Add these functions to the export section at the end of the file
export {
  textToMorse,
  morseToText,
  isValidMorse,
  playMorseAudio,
  morseToBinary,
  binaryToMorse,
  morseCodeMap,
  reverseMorseCodeMap,
}

