export TF_LOG=TRACE

# An AMI
variable "ami" {
  description = "the AMI to use"
}

/* A multi
   line comment. */
resource "aws_instance" "web" {
  ami               = "${var.ami}"
  count             = 2
  source_dest_check = false

  connection {
    user = "root"
  }
}

resource "aws_instance" "web" {
  subnet = "${var.env == "production" ? var.prod_subnet : var.dev_subnet}"
}

variable "count" {
  default = 2
}

variable "hostnames" {
  default = {
    "0" = "example1.org"
    "1" = "example2.net"
  }
}

data "template_file" "web_init" {
  # Render the template once for each instance
  count    = "${length(var.hostnames)}"
  template = "${file("templates/web_init.tpl")}"
  vars {
    # count.index tells us the index of the instance we are rendering
    hostname = "${var.hostnames[count.index]}"
  }
}

resource "aws_instance" "web" {
  # Create one instance for each hostname
  count     = "${length(var.hostnames)}"

  # Pass each instance its corresponding template_file
  user_data = "${data.template_file.web_init.*.rendered[count.index]}"
}

variable "count" {
  default = 2
}

# Define the common tags for all resources
locals {
  common_tags = {
    Component   = "awesome-app"
    Environment = "production"
  }
}

# Create a resource that blends the common tags with instance-specific tags.
resource "aws_instance" "server" {
  ami           = "ami-123456"
  instance_type = "t2.micro"

  tags = "${merge(
    local.common_tags,
    map(
      "Name", "awesome-app-server",
      "Role", "server"
    )
  )}"
}

$ terraform apply -var foo=bar -var foo=baz
$ terraform apply -var 'foo={quux="bar"}' -var 'foo={bar="baz"}'

$ terraform apply -var-file=foo.tfvars -var-file=bar.tfvars
$ TF_VAR_somemap='{foo = "bar", baz = "qux"}' terraform plan

resource "aws_instance" "web" {
  # ...

  count = "${var.count}"

  # Tag the instance with a counter starting at 1, ie. web-001
  tags {
    Name = "${format("web-%03d", count.index + 1)}"
  }
}