"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpError_1 = __importDefault(require("../shared/httpError"));
const businessService_1 = __importDefault(require("./businessService"));
const routes = [
    {
        method: 'GET',
        path: '/business',
        handler: async (req, h) => {
            const { skip, take } = req.query;
            const data = await businessService_1.default.list(skip, take);
            return h.response(data);
        },
    },
    {
        method: 'GET',
        path: '/business/{id}',
        handler: async (req, h) => {
            const { id } = req.params;
            const data = await businessService_1.default.get(Number.parseInt(id, 10));
            if (!data)
                throw httpError_1.default(`Business ${id} not found`).status(404).err();
            return h.response(data);
        },
    },
    {
        method: 'PUT',
        path: '/business',
        handler: async (req, h) => {
            const data = await businessService_1.default.update(req.payload);
            return h.response(data);
        },
    },
    {
        method: 'POST',
        path: '/business',
        handler: async (req, h) => {
            const data = await businessService_1.default.create(req.payload);
            return h.response(data);
        },
    },
    {
        method: 'DELETE',
        path: '/business/{id}',
        handler: async (req, h) => {
            const { id } = req.params;
            await businessService_1.default.delete(Number.parseInt(id, 10));
            return h.response().code(204);
        },
    },
];
exports.default = routes;
