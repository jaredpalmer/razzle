function readPackage(pkg, context) {

    if (pkg.dependencies.razzle) {
        pkg.dependencies.razzle = 'link:../../packages/razzle';
    }

    if (pkg.dependencies['razzle-plugin-webpack5']) {
        pkg.dependencies['razzle-plugin-webpack5'] = 'link:../../packages/razzle-plugin-webpack5';
    }
    return pkg
}
module.exports = {
    hooks: {
        readPackage
    }
}