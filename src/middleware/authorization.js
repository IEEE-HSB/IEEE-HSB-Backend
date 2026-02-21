import { ROLE_PERMISSIONS , USER_ROLES , PERMISSIONS} from "../config/roles.js";
import { asyncHandler } from "../utils/response.js";

export const authorization = (requiredRoles) => {
    return asyncHandler(async (req, res, next) => {

        
        if(!req.user || !req.user.role){
            return next(new Error("Unauthorized", { cause: 403 }));
        }
        const rolePerson = req.user.role;
        if(ROLE_PERMISSIONS[rolePerson] && ROLE_PERMISSIONS[rolePerson].includes(PERMISSIONS.ALL_ACCESS)){
            return next();
        }
        const userPermissions = ROLE_PERMISSIONS[rolePerson] || [];

        if(userPermissions.includes(requiredRoles)){
            return next();
        }
        return next(new Error("Unauthorized", { cause: 403 }));
    });
};




