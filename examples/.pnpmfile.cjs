function readPackage(pkg, context) {

    if (pkg.dependencies.razzle) {
        pkg.dependencies.razzle = 'link:../../packages/razzle';
    }

    return pkg
}
module.exports = {
    hooks: {
        readPackage
    }
}