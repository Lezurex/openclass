module.exports = class ClassRelation {

    static relations = {};

    id;
    class;
    user;
    role;

    constructor(id, classInstance, user, role) {
        this.id = id;
        this.classId = classInstance;
        this.user = user;
        this.role = role;
    }

    static fromDatabaseObject(obj) {
        let relation = new ClassRelation(obj.id, obj.FK_class, obj.FK_user, obj.FK_role);
        ClassRelation.relations[relation.id] = relation;
        return relation;
    }
}