"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const securityRoutes_1 = __importDefault(require("src/features/security/securityRoutes"));
const businessRoutes_1 = __importDefault(require("./features/business/businessRoutes"));
const menuRoutes_1 = __importDefault(require("./features/menu/menuRoutes"));
const menuSectionRoutes_1 = __importDefault(require("./features/menuSection/menuSectionRoutes"));
const menuItemRoutes_1 = __importDefault(require("./features/menuItem/menuItemRoutes"));
const menuItemMediaRoutes_1 = __importDefault(require("./features/menuItemMedia/menuItemMediaRoutes"));
const menuItemIconRoutes_1 = __importDefault(require("./features/menuItemIcon/menuItemIconRoutes"));
//! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Auth post https://www.prisma.io/blog/backend-prisma-typescript-orm-with-postgresql-auth-mngp1ps7kip4
//! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const routes = [
    ...businessRoutes_1.default,
    ...menuRoutes_1.default,
    ...menuSectionRoutes_1.default,
    ...menuItemRoutes_1.default,
    ...menuItemMediaRoutes_1.default,
    ...menuItemIconRoutes_1.default,
    ...securityRoutes_1.default,
];
exports.default = routes;
