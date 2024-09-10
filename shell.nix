# { pkgs ? import <nixpkgs> {} }:

# let
#   project = import ./default.nix { inherit pkgs; };
# in
# pkgs.mkShell {
#   buildInputs = [
#     project.my-server
#     project.my-app
#   ];
# }

{ pkgs ? import <nixpkgs> {} }:

let
  project = import ./default.nix { inherit pkgs; };
in
pkgs.mkShell {
  buildInputs = [
    project.my-server
    project.my-app
    project.my-express
  ];
}