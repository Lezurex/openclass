/*
 * Copyright (c) 2021 Lenny Angst. All rights reserved.
 * For more information about the license read the LICENSE file at the root of this repo.
 * Written for Project: openclass
 * Last modified: 30.04.21, 21:28
 */

import {Class} from "@/entities/Class";
import {Notification} from '@/utils/Notification';
import RequestExecutor from "@/api/RequestExecutor";

const state = () => ({
    all: {}
})

const getters = {
    getAllTasks(state) {
        const tasks = [];
        Object.values(state.all).forEach(cObj => Object.values(cObj.tasks).forEach(task => tasks.push(task)))
        return tasks;
    }
}

const actions = {
    async loadClasses(context) {
        return new Promise((resolve, reject) => {
            const req = new RequestExecutor().buildXHR("class?deep=1", "GET")
            req.addEventListener("load", () => {
                if (req.status === 200) {
                    const data = JSON.parse(req.responseText);
                    const classes = {};
                    Object.values(data).forEach(obj => {
                        const classObj = Class.fromJSONDeep(obj);
                        classes[classObj.id] = classObj;
                    })
                    context.commit("setClasses", classes)
                    resolve(this.state.all);
                } else
                    reject();
            });
            req.send();
        })
    },
    async setTaskTick(context, payload) {
        const task = payload[0];
        const value = payload[1];
        return new Promise((resolve, reject) => {
            const req = new RequestExecutor().buildXHR("class/" + task.classObj.id + "/tasks/" + task.id + "/tick", value ? 'POST' : 'DELETE');
            req.addEventListener("load", async () => {
                if (req.status === 204) {
                    context.commit("setTaskTick", [task, value]);
                    resolve();
                } else {
                    new Notification(global.i18n.global.t("tasks.errors.tickingFailed-title"), global.i18n.global.t("tasks.errors.tickingFailed-desc"), Notification.TYPE.error);
                    await context.commit("setTaskTick", [task, !context.state.all[task.classObj.id].tasks[task.id].ticked]);
                    await context.commit("setTaskTick", [task, !context.state.all[task.classObj.id].tasks[task.id].ticked]);
                    reject();
                }
            });
            req.send();
        })
    }
}

const mutations = {
    /**
     * Sets the classes object
     * @param state
     * @param classes {{Number: Class}}
     */
    setClasses(state, classes) {
        state.all = classes;
    },
    setTaskTick(state, payload) {
        state.all[payload[0].classObj.id].tasks[payload[0].id].ticked = payload[1];
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}