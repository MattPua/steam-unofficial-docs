const fs = require('fs');
const path = require('path');

// Read the OpenAPI file
const openapiPath = path.join(__dirname, '..', 'openapi.json');
const openapi = JSON.parse(fs.readFileSync(openapiPath, 'utf8'));

// Helper function to convert method name to readable format
function formatMethodName(method) {
  // Handle common acronyms first - use longer ones first to avoid partial matches
  const acronyms = ['DOTA2', 'RTMP', 'CSGO', 'HTTPS', 'HTTP', 'UUID', 'JSON', 'XML', 'VDF', 'QR', 'RSA', 'API', 'CDN', 'ID', 'IP'];
  
  let formatted = method;
  
  // Replace acronyms with placeholders first (use very unique placeholders with special chars)
  const placeholderMap = {};
  acronyms.forEach((acronym, index) => {
    // Use a unique placeholder that definitely won't be matched by regex
    const placeholder = `___PLACEHOLDER${index}___`;
    const regex = new RegExp(acronym.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    if (formatted.includes(acronym)) {
      formatted = formatted.replace(regex, placeholder);
      placeholderMap[placeholder] = acronym;
    }
  });
  
  // Convert PascalCase to Title Case with spaces
  // First, handle lowercase followed by uppercase
  formatted = formatted.replace(/([a-z])([A-Z])/g, '$1 $2');
  // Then handle uppercase followed by uppercase+lowercase
  formatted = formatted.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
  
  // Capitalize first letter
  if (formatted.length > 0) {
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }
  
  // Restore acronyms (replace placeholders back)
  Object.entries(placeholderMap).forEach(([placeholder, acronym]) => {
    // Escape the placeholder for regex
    const escapedPlaceholder = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    formatted = formatted.replace(new RegExp(escapedPlaceholder, 'g'), ` ${acronym} `);
  });
  
  // Clean up multiple spaces
  formatted = formatted.replace(/\s+/g, ' ').trim();
  
  return formatted;
}

// Process paths
const newPaths = {};
const pathEntries = Object.entries(openapi.paths);

for (const [oldPath, pathItem] of pathEntries) {
  // Ensure path has /v1 (required for actual API calls)
  // If it doesn't have /v1, add it back
  const apiPath = oldPath.endsWith('/v1') ? oldPath : `${oldPath}/v1`;
  
  // Extract method name from path for display purposes (remove /v1 for naming)
  const displayPath = apiPath.replace(/\/v1$/, '');
  const pathParts = displayPath.split('/').filter(Boolean);
  const methodName = pathParts[pathParts.length - 1];
  
  // Process each HTTP method in the path
  const newPathItem = {};
  for (const [method, operation] of Object.entries(pathItem)) {
    if (method === 'parameters') {
      newPathItem[method] = operation;
      continue;
    }
    
    // Create a new operation object
    const newOperation = { ...operation };
    
    // Add or update operationId (without /v1 for cleaner display)
    newOperation.operationId = methodName;
    
    // Add or update summary (without /v1 for cleaner display)
    newOperation.summary = formatMethodName(methodName);
    
    newPathItem[method] = newOperation;
  }
  
  // Keep the original path with /v1 for actual API calls
  newPaths[apiPath] = newPathItem;
}

// Update the paths
openapi.paths = newPaths;

// Add tag descriptions for better organization
if (!openapi.tags) {
  openapi.tags = [];
}

const tagMap = new Map();
Object.keys(newPaths).forEach((apiPath) => {
  // Remove /v1 for service name extraction
  const displayPath = apiPath.replace(/\/v1$/, '');
  const pathParts = displayPath.split('/').filter(Boolean);
  if (pathParts.length > 0) {
    const serviceName = pathParts[0];
    if (!tagMap.has(serviceName)) {
      tagMap.set(serviceName, {
        name: serviceName,
        description: `${serviceName} endpoints`
      });
    }
  }
});

// Update or add tags
tagMap.forEach((tagInfo) => {
  const existingTag = openapi.tags.find(t => t.name === tagInfo.name);
  if (!existingTag) {
    openapi.tags.push(tagInfo);
  } else if (!existingTag.description) {
    existingTag.description = tagInfo.description;
  }
});

// Ensure all existing tags have descriptions
openapi.tags.forEach((tag) => {
  if (!tag.description) {
    tag.description = `${tag.name} endpoints`;
  }
});

// Sort tags alphabetically
openapi.tags.sort((a, b) => a.name.localeCompare(b.name));

// Write the updated file
fs.writeFileSync(openapiPath, JSON.stringify(openapi, null, 4) + '\n', 'utf8');

console.log(`Processed ${pathEntries.length} paths`);
console.log(`Added ${tagMap.size} tag descriptions`);
console.log('Removed /v1 from all paths and added operationId/summary fields');

