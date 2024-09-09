{ pkgs ? import <nixpkgs> {} }:

let
  project = import ./default.nix { inherit pkgs; };
in
pkgs.mkShell {
  buildInputs = [
    project.my-server
    project.my-app
  ];
}