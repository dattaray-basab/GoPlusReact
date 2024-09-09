{ pkgs ? import <nixpkgs> {} }:

{
  my-server = pkgs.buildGoModule {
    pname = "my-server";
    version = "0.1.0";
    src = ./my-server;
    vendorHash = null;
  };

  my-app = pkgs.mkYarnPackage {
    pname = "my-app";
    version = "0.1.0";
    src = ./my-app;
    packageJSON = ./my-app/package.json;
    yarnLock = ./my-app/yarn.lock;
  };
}