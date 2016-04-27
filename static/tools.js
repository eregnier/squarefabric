function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function serializeProjects(appProjects) {
    var projects = [];
    for(var i=0, j=appProjects.length; i<j;  i++) {
        var project = appProjects[i];
        if (project !== undefined && project !== null && project.name !== undefined) {
            if (project.laize === undefined) {
                project.laize = 140;
            }

            //Ensure all pieces are splitted properly
            var pieces = [];
            for (var k=0, l=project.pieces.length; k<l; k++) {
                delete project.pieces[k].fit;
                var splitted = splitPiece(project.pieces[k], project.laize);
                for (var m=0; m<splitted.length; m++) {
                    pieces.push(splitted[m]);
                }
            }

            projects.push({
                'name': project.name,
                'createdate': project.createdate,
                'updatedate': project.updatedate,
                'description': project.description,
                'pieces': pieces,
                'laize': project.laize,
            });
        }
    }
    return projects
}

function splitPiece(piece, laize) {
    if (piece.w <= laize) {
        return [piece];
    } else {
        //add as many splited pieces as needed
        var pieces = [];
        var chunks = Math.floor(piece.w / laize);
        for (var i=0; i<chunks; i++) {
            var pieceChunck = angular.copy(piece);
            pieceChunck.w = laize;
            pieces.push(pieceChunck);
        }
        console.log('rest', pieces.length);
        //add a new piece that as the length of the rest
        var widthLeft = piece.w - (laize * chunks);
        if (widthLeft > 0) {
            var pieceChunck = angular.copy(piece);
            pieceChunck.w = piece.w - (laize * chunks);
            pieces.push(pieceChunck);
        }
        return pieces;
    }
}