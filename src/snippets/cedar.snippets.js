module.exports = `snippet permit
\tpermit (
\t    principal == \${1:Principal}::"\${2:id}",
\t    action == Action::"\${3:action}",
\t    resource == \${4:Resource}::"\${5:id}"
\t)\${0};
snippet permit_when
\tpermit (principal, action, resource)
\twhen { \${0:condition} };
snippet forbid
\tforbid (principal, action, resource)
\twhen { \${0:condition} };
snippet forbid_unless
\tforbid (principal, action, resource)
\tunless { \${0:condition} };
snippet when
\twhen { \${0:condition} }
snippet unless
\tunless { \${0:condition} }
snippet annotation
\t@\${1:name}("\${2:value}")
`;
