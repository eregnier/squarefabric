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
        if (project !== undefined && project !== null) {
            projects.push({
                'name': project.name,
                'createdate': project.createdate,
                'updatedate': project.updatedate,
                'description': project.description,
                'pieces': project.pieces,
                'laize': project.laize,
            });
        }
    }
    return projects
}