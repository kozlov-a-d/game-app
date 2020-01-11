const Utils = (() => {

    /**
     * Calculate distance between two mesh in 2d context
     * @param {THREE.Mesh} meshA 
     * @param {THREE.Mesh} meshB 
     * @returns {Number} distance
     */
    const distanceBetween2d = (meshA, meshB) => {
        let distance;
        distance = Math.sqrt( Math.pow(meshB.position.x - meshA.position.x, 2) + Math.pow(meshB.position.y - meshA.position.y, 2));
        return distance;
    }

    /**
     * Calculate distance between two mesh in 3d context
     * @param {THREE.Mesh} meshA 
     * @param {THREE.Mesh} meshB 
     * @returns {Number} distance
     */
    const distanceBetween3d = (meshA, meshB) => {
        let distance;
        distance = Math.sqrt( Math.pow(meshB.position.x - meshA.position.x, 2) + Math.pow(meshB.position.y - meshA.position.y, 2) + Math.pow(meshB.position.z - meshA.position.z, 2));
        return distance;
    }

    /**
     * Detect collision with other mesh
     * @param {THREE.Mesh} thisMesh 
     * @param {Array.<THREE.Mesh>} meshListToCollision 
     */
    const detectCollision = (thisMesh, meshListToCollision) => {
        let isCollision = false;
        thisMesh.geometry.computeBoundingBox(); 
        thisMesh.updateMatrixWorld();
        let box1 = thisMesh.geometry.boundingBox.clone();
        box1.applyMatrix4(thisMesh.matrixWorld);

        meshListToCollision.forEach((item, index) => {
            // console.log(item.name);
            if (distanceBetween3d(thisMesh, item) < 5) {
                item.geometry.computeBoundingBox();
                item.updateMatrixWorld();
            
                let box2 = item.geometry.boundingBox.clone();
                box2.applyMatrix4(item.matrixWorld);
    
                let result = box1.intersectsBox(box2);
                if (result) isCollision = index;
            }
        });

        return isCollision;
    }


    return Object.freeze({
        detectCollision,
        distanceBetween2d,
        distanceBetween3d
    })
})();

export default Utils;