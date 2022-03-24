package k8sblocknodeport

violation[{"msg": msg}] {
  input.review.kind.kind == "Service"
  input.review.object.spec.type == "NodePort"
  msg := "User is not allowed to create service of type NodePort"
}
