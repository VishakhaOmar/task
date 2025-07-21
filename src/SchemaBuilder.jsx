import React, { useState, useRef, useEffect } from "react";
import "./SchemaBuilder.css";

const defaultField = () => ({
  key: "",
  type: "String",
  children: [],
});

const defaultSchema = () => ({
  fields: [defaultField()],
});

const Field = ({ field, onChange, onDelete, onAddNested }) => {
  return (
    <div className="field-row">
      <input
        type="text"
        placeholder="Key"
        value={field.key}
        onChange={(e) => onChange({ ...field, key: e.target.value })}
      />
      <select
        value={field.type}
        onChange={(e) => onChange({ ...field, type: e.target.value, children: [] })}
      >
        <option value="String">String</option>
        <option value="Number">Number</option>
        <option value="Nested">Nested</option>
      </select>

      <button onClick={onDelete}>🗑️</button>

      {field.type === "Nested" && (
        <button onClick={onAddNested}>➕ Nested</button>
      )}

      {field.type === "Nested" && field.children?.length > 0 && (
        <div className="nested-fields">
          {field.children.map((child, idx) => (
            <Field
              key={idx}
              field={child}
              onChange={(updatedChild) => {
                const updatedChildren = [...field.children];
                updatedChildren[idx] = updatedChild;
                onChange({ ...field, children: updatedChildren });
              }}
              onDelete={() => {
                const updatedChildren = field.children.filter((_, i) => i !== idx);
                onChange({ ...field, children: updatedChildren });
              }}
              onAddNested={() =>
                onChange({
                  ...field,
                  children: [...field.children, defaultField()],
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

const SchemaBuilder = () => {
  const [schemas, setSchemas] = useState([defaultSchema()]);
  const scrollRef = useRef(null);

  const handleAddSchema = () => {
    setSchemas((prev) => [...prev, defaultSchema()]);
  };

  const handleDeleteSchema = (index) => {
    const updated = [...schemas];
    updated.splice(index, 1);
    setSchemas(updated);
  };

  const handleFieldChange = (schemaIndex, fieldIndex, updatedField) => {
    const updatedSchemas = [...schemas];
    updatedSchemas[schemaIndex].fields[fieldIndex] = updatedField;
    setSchemas(updatedSchemas);
  };

  const handleAddField = (schemaIndex) => {
    const updated = [...schemas];
    updated[schemaIndex].fields.push(defaultField());
    setSchemas(updated);
  };

  const handleDeleteField = (schemaIndex, fieldIndex) => {
    const updated = [...schemas];
    updated[schemaIndex].fields.splice(fieldIndex, 1);
    setSchemas(updated);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [schemas]);

  const generateJSON = (fields) => {
    const json = {};
    fields.forEach((field) => {
      if (!field.key) return;
      if (field.type === "Nested") {
        json[field.key] = generateJSON(field.children);
      } else if (field.type === "Number") {
        json[field.key] = 0;
      } else {
        json[field.key] = "";
      }
    });
    return json;
  };

  return (
    <div className="schema-builder-container">
      <h1>🧩 JSON Schema Builder</h1>

      <div className="schema-scroll-wrapper" ref={scrollRef}>
        {schemas.map((schema, schemaIndex) => (
          <div key={schemaIndex} className="schema-box">
            <div className="schema-header">
              <h3>Schema Scope {schemaIndex + 1}</h3>
              <button onClick={() => handleDeleteSchema(schemaIndex)}>❌</button>
            </div>

            {schema.fields.map((field, fieldIndex) => (
              <Field
                key={fieldIndex}
                field={field}
                onChange={(updated) => handleFieldChange(schemaIndex, fieldIndex, updated)}
                onDelete={() => handleDeleteField(schemaIndex, fieldIndex)}
                onAddNested={() =>
                  handleFieldChange(schemaIndex, fieldIndex, {
                    ...field,
                    children: [...(field.children || []), defaultField()],
                  })
                }
              />
            ))}

            <button onClick={() => handleAddField(schemaIndex)} className="add-field-btn">
              ➕ Add Field
            </button>

            <div className="json-preview">
              <strong>JSON Output:</strong>
              <pre>{JSON.stringify(generateJSON(schema.fields), null, 2)}</pre>
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleAddSchema} className="add-scope-btn">
        ➕ Add New Schema Scope
      </button>
    </div>
  );
};

export default SchemaBuilder;
