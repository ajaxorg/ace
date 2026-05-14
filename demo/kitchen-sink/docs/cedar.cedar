// Cedar Policy Language
// Cedar is used to define authorization policies for AWS Verified Permissions

@id("photo-access")
permit (
    principal == User::"alice",
    action == Action::"viewPhoto",
    resource == Photo::"vacation"
)
when { resource.tags.contains("public") && context.authenticated == true };

// Forbid access unless in admin group
forbid (principal, action, resource)
unless { principal in Group::"admins" };

// Template policy with IP restriction
permit (
    principal == ?principal,
    action,
    resource
)
when {
    ip(context.sourceIp).isLoopback() ||
    ip(context.sourceIp).isInRange(ip("10.0.0.0/8"))
};

// Policy using decimal and datetime extensions
permit (
    principal,
    action == Action::"purchase",
    resource
)
when {
    decimal(resource.price).lessThanOrEqual(decimal("100.00")) &&
    datetime(context.timestamp).toDate() == datetime("2025-01-01")
};

// Conditional logic with has and like
permit (
    principal is User in Group::"employees",
    action == Action::"read",
    resource
)
when {
    resource has department &&
    principal.email like "*@example.com" &&
    if resource.confidential then principal in Group::"managers" else true
};

@annotation("example")
forbid (
    principal,
    action,
    resource
)
when {
    context.riskScore > 80 ||
    [Action::"delete", Action::"modify"].contains(action)
};
