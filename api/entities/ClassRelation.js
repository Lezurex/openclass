module.exports = class ClassRelation {

    id;
    class;
    user;
    role;

    constructor(id, classInstance, user, role) {
        this.id = id;
        this.class = classInstance;
        this.user = user;
        this.role = role;
    }

    static fromDatabaseObject(obj) {
        let relation = new ClassRelation(parseInt(obj.id), global.classes[obj.FK_class + ''], global.users[obj.FK_user + ''], global.roles[obj.FK_role + '']);
        global.classRelations[relation.id] = relation;
        return relation;
    }
}