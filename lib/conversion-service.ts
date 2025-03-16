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

export interface ConversionResult {
  success: boolean
  result: string
  error?: string
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

      if (format === "json-to-xml") {
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
          result = html
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
  ],
  xml: [{ value: "json", label: "JSON" }],
  yaml: [{ value: "json", label: "JSON" }],
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
  ],
  tsv: [{ value: "json", label: "JSON" }],
}

