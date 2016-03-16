var lodash = require('lodash');

module.exports = function (filesToCompile, dependencies) {

    lodash.forEach(filesToCompile, function (fileId, fileIndex) {
        var indexToBeMoved = fileIndex;
        var aux;

        if (dependencies[fileId]) {
            lodash.forEach(dependencies, function (otherFileDependencies, key) {
                var consumerIndex;

                if (otherFileDependencies.indexOf(fileId) > -1) {
                    consumerIndex = filesToCompile.indexOf(key);

                    if (indexToBeMoved > consumerIndex && consumerIndex !== -1) {
                        indexToBeMoved = consumerIndex;
                    }
                }
            });

            aux = filesToCompile[indexToBeMoved];
            filesToCompile[indexToBeMoved] = fileId;
            filesToCompile[fileIndex] = aux;
        }
    });

    return filesToCompile;
};