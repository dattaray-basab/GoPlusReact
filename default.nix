
# { pkgs ? import <nixpkgs> {} }:

# {
#   my-server = pkgs.buildGoModule {
#     pname = "my-server";
#     version = "0.1.0";
#     src = ./my-server;
#     vendorHash = null;  # Use the correct hash if you're using vendoring
#   };

#   my-app = pkgs.mkYarnPackage {
#     pname = "my-app";
#     version = "0.1.0";
#     src = ./my-app;
#     packageJSON = ./my-app/package.json;
#     yarnLock = ./my-app/yarn.lock;
#   };
# }

{ pkgs ? import <nixpkgs> {} }:

{
  my-server = pkgs.buildGoModule {
    pname = "my-server";
    version = "0.1.0";
    src = ./my-server;
    vendorSha256 = null; # Set this to the correct hash or null if you're not using vendoring
  };

  my-app = pkgs.mkYarnPackage {
    pname = "my-app";
    version = "0.1.0";
    src = ./my-app;
    packageJSON = ./my-app/package.json;
    yarnLock = ./my-app/yarn.lock;
  };

  my-express = pkgs.buildNpmPackage {
    pname = "my-express";
    version = "0.1.0";
    src = ./my-express;
    npmDepsHash = "sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="; # Replace with actual hash
  };
}