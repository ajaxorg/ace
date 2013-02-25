define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var lslHighlightRules = function() {

    var keywords = (
        "default|event|state"
    );

    var controlKeywords = (
        "do|else|for|if|jump|return|while"
    );
    
    var types = (
        "float|integer|key|list|quaternion|rotation|string|vector"
    );

    var constants = (
        "ACTIVE|AGENT|AGENT_ALWAYS_RUN|AGENT_ATTACHMENTS|AGENT_AUTOPILOT|AGENT_AWAY|" +
        "AGENT_BUSY|AGENT_BY_LEGACY_NAME|AGENT_BY_USERNAME|AGENT_CROUCHING|AGENT_FLYING|" +
        "AGENT_IN_AIR|AGENT_LIST_PARCEL|AGENT_LIST_PARCEL_OWNER|AGENT_LIST_REGION|" +
        "AGENT_MOUSELOOK|AGENT_ON_OBJECT|AGENT_SCRIPTED|AGENT_SITTING|AGENT_TYPING|" +
        "AGENT_WALKING|ALL_SIDES|ANIM_ON|ATTACH_BACK|ATTACH_BELLY|ATTACH_CHEST|" +
        "ATTACH_CHIN|ATTACH_HEAD|ATTACH_HUD_BOTTOM|ATTACH_HUD_BOTTOM_LEFT|" +
        "ATTACH_HUD_BOTTOM_RIGHT|ATTACH_HUD_CENTER_1|ATTACH_HUD_CENTER_2|" +
        "ATTACH_HUD_TOP_CENTER|ATTACH_HUD_TOP_LEFT|ATTACH_HUD_TOP_RIGHT|ATTACH_LEAR|" +
        "ATTACH_LEFT_PEC|ATTACH_LEYE|ATTACH_LFOOT|ATTACH_LHAND|ATTACH_LHIP|ATTACH_LLARM|" +
        "ATTACH_LLLEG|ATTACH_LSHOULDER|ATTACH_LUARM|ATTACH_LULEG|ATTACH_MOUTH|" +
        "ATTACH_NOSE|ATTACH_PELVIS|ATTACH_REAR|ATTACH_REYE|ATTACH_RFOOT|ATTACH_RHAND|" +
        "ATTACH_RHIP|ATTACH_RIGHT_PEC|ATTACH_RLARM|ATTACH_RLLEG|ATTACH_RSHOULDER|" +
        "ATTACH_RUARM|ATTACH_RULEG|CAMERA_ACTIVE|CAMERA_BEHINDNESS_ANGLE|" +
        "CAMERA_BEHINDNESS_LAG|CAMERA_DISTANCE|CAMERA_FOCUS|CAMERA_FOCUS_LAG|" +
        "CAMERA_FOCUS_LOCKED|CAMERA_FOCUS_OFFSET|CAMERA_FOCUS_THRESHOLD|CAMERA_PITCH|" +
        "CAMERA_POSITION|CAMERA_POSITION_LAG|CAMERA_POSITION_LOCKED|" +
        "CAMERA_POSITION_THRESHOLD|CHANGED_ALLOWED_DROP|CHANGED_COLOR|CHANGED_INVENTORY|" +
        "CHANGED_LINK|CHANGED_MEDIA|CHANGED_OWNER|CHANGED_REGION|CHANGED_REGION_START|" +
        "CHANGED_SCALE|CHANGED_SHAPE|CHANGED_TELEPORT|CHANGED_TEXTURE|" +
        "CHARACTER_ACCOUNT_FOR_SKIPPED_FRAMES|CHARACTER_DESIRED_SPEED|CHARACTER_LENGTH|" +
        "CHARACTER_ORIENTATION|CHARACTER_RADIUS|CHARACTER_TYPE|CHARACTER_TYPE_A|" +
        "CHARACTER_TYPE_B|CHARACTER_TYPE_C|CHARACTER_TYPE_D|CHARACTER_TYPE_NONE|" +
        "CLICK_ACTION_BUY|CLICK_ACTION_NONE|CLICK_ACTION_OPEN|CLICK_ACTION_OPEN_MEDIA|" +
        "CLICK_ACTION_PAY|CLICK_ACTION_PLAY|CLICK_ACTION_SIT|CLICK_ACTION_TOUCH|" +
        "CONTROL_BACK|CONTROL_DOWN|CONTROL_FWD|CONTROL_LBUTTON|CONTROL_LEFT|" +
        "CONTROL_ML_LBUTTON|CONTROL_RIGHT|CONTROL_ROT_LEFT|CONTROL_ROT_RIGHT|CONTROL_UP|" +
        "DATA_BORN|DATA_NAME|DATA_ONLINE|DATA_PAYINFO|DATA_RATING|DATA_SIM_POS|" +
        "DATA_SIM_RATING|DATA_SIM_STATUS|DEBUG_CHANNEL|DEG_TO_RAD|EOF|" +
        "ESTATE_ACCESS_BANNED_AGENT_ADD|FALSE|HORIZONTAL|HTTP_BODY_MAXLENGTH|" +
        "HTTP_BODY_TRUNCATED|HTTP_METHOD|HTTP_MIMETYPE|HTTP_PRAGMA_NO_CACHE|" +
        "HTTP_VERBOSE_THROTTLE|HTTP_VERIFY_CERT|INVENTORY_ALL|INVENTORY_ANIMATION|" +
        "INVENTORY_BODYPART|INVENTORY_CLOTHING|INVENTORY_GESTURE|INVENTORY_LANDMARK|" +
        "INVENTORY_NONE|INVENTORY_NOTECARD|INVENTORY_OBJECT|INVENTORY_SCRIPT|" +
        "INVENTORY_SOUND|INVENTORY_TEXTURE|LAND_LEVEL|LAND_LOWER|LAND_NOISE|LAND_RAISE|" +
        "LAND_REVERT|LAND_SMOOTH|LINK_ALL_CHILDREN|LINK_ALL_OTHERS|LINK_ROOT|LINK_SET|" +
        "LINK_THIS|LIST_STAT_GEOMETRIC_MEAN|LIST_STAT_MAX|LIST_STAT_MEAN|" +
        "LIST_STAT_MEDIAN|LIST_STAT_MIN|LIST_STAT_NUM_COUNT|LIST_STAT_RANGE|" +
        "LIST_STAT_STD_DEV|LIST_STAT_SUM|LIST_STAT_SUM_SQUARES|LOOP|MASK_BASE|" +
        "MASK_EVERYONE|MASK_GROUP|MASK_NEXT|MASK_OWNER|NULL_KEY|OBJECT_ATTACHED_POINT|" +
        "OBJECT_CREATOR|OBJECT_DESC|OBJECT_GROUP|OBJECT_NAME|OBJECT_OWNER|" +
        "OBJECT_PATHFINDING_TYPE|OBJECT_PHANTOM|OBJECT_PHYSICS|OBJECT_POS|" +
        "OBJECT_PRIM_EQUIVALENCE|OBJECT_ROOT|OBJECT_ROT|OBJECT_RUNNING_SCRIPT_COUNT|" +
        "OBJECT_SCRIPT_MEMORY|OBJECT_SCRIPT_TIME|OBJECT_TEMP_ON_REZ|" +
        "OBJECT_TOTAL_SCRIPT_COUNT|OBJECT_UNKNOWN_DETAIL|OBJECT_VELOCITY|OPT_CHARACTER|" +
        "OPT_AVATAR|OPT_EXCLUSION_VOLUME|OPT_LEGACY_LINKSET|OPT_MATERIAL_VOLUME|" +
        "OPT_OTHER|OPT_STATIC_OBSTACLE|OPT_WALKABLE|PARCEL_COUNT_GROUP|" +
        "PARCEL_COUNT_OTHER|PARCEL_COUNT_OWNER|PARCEL_COUNT_SELECTED|PARCEL_COUNT_TEMP|" +
        "PARCEL_COUNT_TOTAL|PARCEL_DETAILS_AREA|PARCEL_DETAILS_DESC|PARCEL_DETAILS_GROUP|" +
        "PARCEL_DETAILS_ID|PARCEL_DETAILS_NAME|PARCEL_DETAILS_OWNER|" +
        "PARCEL_DETAILS_SEE_AVATARS|PARCEL_FLAG_ALLOW_ALL_OBJECT_ENTRY|" +
        "PARCEL_FLAG_ALLOW_CREATE_GROUP_OBJECTS|PARCEL_FLAG_ALLOW_CREATE_OBJECTS|" +
        "PARCEL_FLAG_ALLOW_DAMAGE|PARCEL_FLAG_ALLOW_FLY|" +
        "PARCEL_FLAG_ALLOW_GROUP_OBJECT_ENTRY|PARCEL_FLAG_ALLOW_GROUP_SCRIPTS|" +
        "PARCEL_FLAG_ALLOW_LANDMARK|PARCEL_FLAG_ALLOW_SCRIPTS|" +
        "PARCEL_FLAG_ALLOW_TERRAFORM|PARCEL_FLAG_LOCAL_SOUND_ONLY|" +
        "PARCEL_FLAG_RESTRICT_PUSHOBJECT|PARCEL_FLAG_USE_ACCESS_GROUP|" +
        "PARCEL_FLAG_USE_ACCESS_LIST|PARCEL_FLAG_USE_BAN_LIST|" +
        "PARCEL_FLAG_USE_LAND_PASS_LIST|PARCEL_MEDIA_COMMAND_AGENT|" +
        "PARCEL_MEDIA_COMMAND_AUTO_ALIGN|PARCEL_MEDIA_COMMAND_DESC|" +
        "PARCEL_MEDIA_COMMAND_LOOP|PARCEL_MEDIA_COMMAND_LOOP_SET|" +
        "PARCEL_MEDIA_COMMAND_PAUSE|PARCEL_MEDIA_COMMAND_PLAY|PARCEL_MEDIA_COMMAND_SIZE|" +
        "PARCEL_MEDIA_COMMAND_STOP|PARCEL_MEDIA_COMMAND_TEXTURE|" +
        "PARCEL_MEDIA_COMMAND_TIME|PARCEL_MEDIA_COMMAND_TYPE|PARCEL_MEDIA_COMMAND_UNLOAD|" +
        "PARCEL_MEDIA_COMMAND_URL|PASSIVE|PAYMENT_INFO_ON_FILE|PAYMENT_INFO_USED|" +
        "PAY_DEFAULT|PAY_HIDE|PERMISSION_ATTACH|PERMISSION_CHANGE_LINKS|" +
        "PERMISSION_CONTROL_CAMERA|PERMISSION_DEBIT|PERMISSION_SILENT_ESTATE_MANAGEMENT|" +
        "PERMISSION_TAKE_CONTROLS|PERMISSION_TELEPORT|PERMISSION_TRACK_CAMERA|" +
        "PERMISSION_TRIGGER_ANIMATION|PERM_ALL|PERM_COPY|PERM_MODIFY|PERM_MOVE|" +
        "PERM_TRANSFER|PI|PING_PONG|PI_BY_TWO|PRIM_BUMP_BARK|PRIM_BUMP_BLOBS|" +
        "PRIM_BUMP_BRICKS|PRIM_BUMP_BRIGHT|PRIM_BUMP_CHECKER|PRIM_BUMP_CONCRETE|" +
        "PRIM_BUMP_DARK|PRIM_BUMP_DISKS|PRIM_BUMP_GRAVEL|PRIM_BUMP_LARGETILE|" +
        "PRIM_BUMP_NONE|PRIM_BUMP_SHINY|PRIM_BUMP_SIDING|PRIM_BUMP_STONE|" +
        "PRIM_BUMP_STUCCO|PRIM_BUMP_SUCTION|PRIM_BUMP_TILE|PRIM_BUMP_WEAVE|" +
        "PRIM_BUMP_WOOD|PRIM_COLOR|PRIM_DESC|PRIM_FLEXIBLE|PRIM_FULLBRIGHT|PRIM_GLOW|" +
        "PRIM_HOLE_CIRCLE|PRIM_HOLE_DEFAULT|PRIM_HOLE_SQUARE|PRIM_HOLE_TRIANGLE|" +
        "PRIM_LINK_TARGET|PRIM_MATERIAL|PRIM_MATERIAL_FLESH|PRIM_MATERIAL_GLASS|" +
        "PRIM_MATERIAL_LIGHT|PRIM_MATERIAL_METAL|PRIM_MATERIAL_PLASTIC|" +
        "PRIM_MATERIAL_RUBBER|PRIM_MATERIAL_STONE|PRIM_MATERIAL_WOOD|" +
        "PRIM_MEDIA_PERM_ANYONE|PRIM_MEDIA_PERM_GROUP|PRIM_MEDIA_PERM_NONE|" +
        "PRIM_MEDIA_PERM_OWNER|PRIM_NAME|PRIM_OMEGA|PRIM_PHANTOM|PRIM_PHYSICS|" +
        "PRIM_PHYSICS_SHAPE_NONE|PRIM_PHYSICS_SHAPE_TYPE|PRIM_POINT_LIGHT|PRIM_POSITION|" +
        "PRIM_POS_LOCAL|PRIM_ROTATION|PRIM_ROT_LOCAL|PRIM_SCULPT_FLAG_INVERT|" +
        "PRIM_SCULPT_FLAG_MIRROR|PRIM_SCULPT_TYPE_CYLINDER|PRIM_SCULPT_TYPE_MASK|" +
        "PRIM_SCULPT_TYPE_PLANE|PRIM_SCULPT_TYPE_SPHERE|PRIM_SCULPT_TYPE_TORUS|" +
        "PRIM_SHINY_HIGH|PRIM_SHINY_LOW|PRIM_SHINY_MEDIUM|PRIM_SHINY_NONE|PRIM_SIZE|" +
        "PRIM_SLICE|PRIM_TEMP_ON_REZ|PRIM_TEXGEN|PRIM_TEXGEN_DEFAULT|PRIM_TEXGEN_PLANAR|" +
        "PRIM_TEXT|PRIM_TEXTURE|PRIM_TYPE|PRIM_TYPE_BOX|PRIM_TYPE_CYLINDER|" +
        "PRIM_TYPE_PRISM|PRIM_TYPE_RING|PRIM_TYPE_SCULPT|PRIM_TYPE_SPHERE|" +
        "PRIM_TYPE_TORUS|PRIM_TYPE_TUBE|PROFILE_NONE|PROFILE_SCRIPT_MEMORY|" +
        "PUBLIC_CHANNEL|RAD_TO_DEG|RCERR_CAST_TIME_EXCEEDED|RCERR_SIM_PERF_LOW|" +
        "RCERR_UNKNOWN|RC_DATA_FLAGS|RC_DETECT_PHANTOM|RC_GET_LINK_NUM|RC_GET_NORMAL|" +
        "RC_GET_ROOT_KEY|RC_MAX_HITS|RC_REJECT_AGENTS|RC_REJECT_LAND|" +
        "RC_REJECT_NONPHYSICAL|RC_REJECT_PHYSICAL|RC_REJECT_TYPES|" +
        "REGION_FLAG_ALLOW_DAMAGE|REGION_FLAG_ALLOW_DIRECT_TELEPORT|" +
        "REGION_FLAG_BLOCK_FLY|REGION_FLAG_BLOCK_TERRAFORM|" +
        "REGION_FLAG_DISABLE_COLLISIONS|REGION_FLAG_DISABLE_PHYSICS|" +
        "REGION_FLAG_FIXED_SUN|REGION_FLAG_RESTRICT_PUSHOBJECT|REGION_FLAG_SANDBOX|" +
        "REMOTE_DATA_CHANNEL|REMOTE_DATA_REPLY|REMOTE_DATA_REQUEST|REVERSE|ROTATE|SCALE|" +
        "SCRIPTED|SIM_STAT_PCT_CHARS_STEPPED|SMOOTH|SQRT2|STATUS_BLOCK_GRAB|" +
        "STATUS_BLOCK_GRAB_OBJECT|STATUS_CAST_SHADOWS|STATUS_DIE_AT_EDGE|STATUS_PHANTOM|" +
        "STATUS_PHYSICS|STATUS_RETURN_AT_EDGE|STATUS_ROTATE_X|STATUS_ROTATE_Y|" +
        "STATUS_ROTATE_Z|STATUS_SANDBOX|STRING_TRIM|STRING_TRIM_HEAD|STRING_TRIM_TAIL|" +
        "TEXTURE_BLANK|TEXTURE_MEDIA|TEXTURE_PLYWOOD|TEXTURE_TRANSPARENT|" +
        "TOUCH_INVALID_FACE|TOUCH_INVALID_TEXCOORD|TOUCH_INVALID_VECTOR|TRAVERSAL_TYPE|" +
        "TRUE|TWO_PI|TYPE_FLOAT|TYPE_INTEGER|TYPE_INVALID|TYPE_KEY|TYPE_ROTATION|" +
        "TYPE_STRING|TYPE_VECTOR|URL_REQUEST_DENIED|URL_REQUEST_GRANTED|" +
        "VEHICLE_ANGULAR_DEFLECTION_EFFICIENCY|VEHICLE_ANGULAR_DEFLECTION_TIMESCALE|" +
        "VEHICLE_ANGULAR_FRICTION_TIMESCALE|VEHICLE_ANGULAR_MOTOR_DECAY_TIMESCALE|" +
        "VEHICLE_ANGULAR_MOTOR_DIRECTION|VEHICLE_ANGULAR_MOTOR_TIMESCALE|" +
        "VEHICLE_BANKING_EFFICIENCY|VEHICLE_BANKING_MIX|VEHICLE_BANKING_TIMESCALE|" +
        "VEHICLE_BUOYANCY|VEHICLE_FLAG_CAMERA_DECOUPLED|VEHICLE_FLAG_HOVER_GLOBAL_HEIGHT|" +
        "VEHICLE_FLAG_HOVER_TERRAIN_ONLY|VEHICLE_FLAG_HOVER_UP_ONLY|" +
        "VEHICLE_FLAG_HOVER_WATER_ONLY|VEHICLE_FLAG_LIMIT_MOTOR_UP|" +
        "VEHICLE_FLAG_LIMIT_ROLL_ONLY|VEHICLE_FLAG_MOUSELOOK_BANK|" +
        "VEHICLE_FLAG_MOUSELOOK_STEER|VEHICLE_FLAG_NO_DEFLECTION_UP|" +
        "VEHICLE_HOVER_EFFICIENCY|VEHICLE_HOVER_HEIGHT|VEHICLE_HOVER_TIMESCALE|" +
        "VEHICLE_LINEAR_DEFLECTION_EFFICIENCY|VEHICLE_LINEAR_DEFLECTION_TIMESCALE|" +
        "VEHICLE_LINEAR_FRICTION_TIMESCALE|VEHICLE_LINEAR_MOTOR_DECAY_TIMESCALE|" +
        "VEHICLE_LINEAR_MOTOR_DIRECTION|VEHICLE_LINEAR_MOTOR_OFFSET|" +
        "VEHICLE_LINEAR_MOTOR_TIMESCALE|VEHICLE_REFERENCE_FRAME|VEHICLE_TYPE_AIRPLANE|" +
        "VEHICLE_TYPE_BALLOON|VEHICLE_TYPE_BOAT|VEHICLE_TYPE_CAR|VEHICLE_TYPE_NONE|" +
        "VEHICLE_TYPE_SLED|VEHICLE_VERTICAL_ATTRACTION_EFFICIENCY|" +
        "VEHICLE_VERTICAL_ATTRACTION_TIMESCALE|VERTICAL|ZERO_ROTATION|ZERO_VECTOR"
    );

    var events = (
        "at_rot_target|at_target|attach|changed|collision|collision_end|collision_start|" +
        "control|dataserver|email|http_request|http_response|land_collision|" +
        "land_collision_end|land_collision_start|link_message|listen|money|moving_end|" +
        "moving_start|no_sensor|not_at_rot_target|not_at_target|object_rez|on_rez|" +
        "path_update|remote_data|run_time_permissions|sensor|state_entry|state_exit|" +
        "timer|touch|touch_end|touch_start|transaction_result"
    );

    var functions = (
        "llAbs|llAcos|llAddToLandBanList|llAddToLandPassList|llAdjustSoundVolume|" +
        "llAllowInventoryDrop|llAngleBetween|llApplyImpulse|llApplyRotationalImpulse|" +
        "llAsin|llAtan2|llAttachToAvatar|llAttachToAvatarTemp|llAvatarOnLinkSitTarget|" +
        "llAvatarOnSitTarget|llAxes2Rot|llAxisAngle2Rot|llBase64ToInteger|" +
        "llBase64ToString|llBreakAllLinks|llBreakLink|llCastRay|llCeil|" +
        "llClearCameraParams|llClearLinkMedia|llClearPrimMedia|llCloseRemoteDataChannel|" +
        "llCloud|llCollisionFilter|llCollisionSound|llCollisionSprite|llCos|llCreateLink|" +
        "llCSV2List|llDeleteSubList|llDeleteSubString|llDetachFromAvatar|llDetectedGrab|" +
        "llDetectedGroup|llDetectedKey|llDetectedLinkNumber|llDetectedName|" +
        "llDetectedOwner|llDetectedPos|llDetectedRot|llDetectedTouchBinormal|" +
        "llDetectedTouchFace|llDetectedTouchNormal|llDetectedTouchPos|llDetectedTouchST|" +
        "llDetectedTouchUV|llDetectedType|llDetectedVel|llDialog|llDie|llDumpList2String|" +
        "llEdgeOfWorld|llEjectFromLand|llEmail|llEscapeURL|llEuler2Rot|llFabs|llFloor|" +
        "llForceMouselook|llFrand|llGenerateKey|llGetAccel|llGetAgentInfo|" +
        "llGetAgentLanguage|llGetAgentList|llGetAgentSize|llGetAlpha|llGetAndResetTime|" +
        "llGetAnimation|llGetAnimationList|llGetAttached|llGetBoundingBox|llGetCameraPos|" +
        "llGetCameraRot|llGetCenterOfMass|llGetColor|llGetCreator|llGetDate|" +
        "llGetDisplayName|llGetEnergy|llGetEnv|llGetForce|llGetFreeMemory|llGetFreeURLs|" +
        "llGetGeometricCenter|llGetGMTclock|llGetHTTPHeader|llGetInventoryCreator|" +
        "llGetInventoryKey|llGetInventoryName|llGetInventoryNumber|" +
        "llGetInventoryPermMask|llGetInventoryType|llGetKey|llGetLandOwnerAt|" +
        "llGetLinkKey|llGetLinkMedia|llGetLinkName|llGetLinkNumber|" +
        "llGetLinkNumberOfSides|llGetLinkPrimitiveParams|llGetListEntryType|" +
        "llGetListLength|llGetLocalPos|llGetLocalRot|llGetMass|llGetMassMKS|" +
        "llGetMemoryLimit|llGetNextEmail|llGetNotecardLine|llGetNumberOfNotecardLines|" +
        "llGetNumberOfPrims|llGetNumberOfSides|llGetObjectDesc|llGetObjectDetails|" +
        "llGetObjectMass|llGetObjectName|llGetObjectPermMask|llGetObjectPrimCount|" +
        "llGetOmega|llGetOwner|llGetOwnerKey|llGetParcelDetails|llGetParcelFlags|" +
        "llGetParcelMaxPrims|llGetParcelMusicURL|llGetParcelPrimCount|" +
        "llGetParcelPrimOwners|llGetPermissions|llGetPermissionsKey|llGetPhysicsMaterial|" +
        "llGetPos|llGetPrimitiveParams|llGetPrimMediaParams|llGetRegionAgentCount|" +
        "llGetRegionCorner|llGetRegionFlags|llGetRegionFPS|llGetRegionName|" +
        "llGetRegionTimeDilation|llGetRootPosition|llGetRootRotation|llGetRot|llGetScale|" +
        "llGetScriptName|llGetScriptState|llGetSimStats|llGetSimulatorHostname|" +
        "llGetSPMaxMemory|llGetStartParameter|llGetStatus|llGetSubString|" +
        "llGetSunDirection|llGetTexture|llGetTextureOffset|llGetTextureRot|" +
        "llGetTextureScale|llGetTime|llGetTimeOfDay|llGetTimestamp|llGetTorque|" +
        "llGetUnixTime|llGetUsedMemory|llGetUsername|llGetVel|llGetWallclock|" +
        "llGiveInventory|llGiveInventoryList|llGiveMoney|llGround|llGroundContour|" +
        "llGroundNormal|llGroundRepel|llGroundSlope|llHTTPRequest|llHTTPResponse|" +
        "llInsertString|llInstantMessage|llIntegerToBase64|llKey2Name|" +
        "llLinkParticleSystem|llLinkSitTarget|llList2CSV|llList2Float|llList2Integer|" +
        "llList2Key|llList2List|llList2ListStrided|llList2Rot|llList2String|" +
        "llList2Vector|llListen|llListenControl|llListenRemove|llListFindList|" +
        "llListInsertList|llListRandomize|llListReplaceList|llListSort|llListStatistics|" +
        "llLoadURL|llLog|llLog10|llLookAt|llLoopSound|llLoopSoundMaster|llLoopSoundSlave|" +
        "llManageEstateAccess|llMapDestination|llMD5String|llMessageLinked|" +
        "llMinEventDelay|llModifyLand|llModPow|llMoveToTarget|llOffsetTexture|" +
        "llOpenRemoteDataChannel|llOverMyLand|llOwnerSay|llParcelMediaCommandList|" +
        "llParcelMediaQuery|llParseString2List|llParseStringKeepNulls|llParticleSystem|" +
        "llPassCollisions|llPassTouches|llPlaySound|llPlaySoundSlave|llPow|" +
        "llPreloadSound|llPushObject|llRegionSay|llRegionSayTo|llReleaseControls|" +
        "llReleaseURL|llRemoteDataReply|llRemoteLoadScriptPin|llRemoveFromLandBanList|" +
        "llRemoveFromLandPassList|llRemoveInventory|llRemoveVehicleFlags|" +
        "llRequestAgentData|llRequestDisplayName|llRequestInventoryData|" +
        "llRequestPermissions|llRequestSecureURL|llRequestSimulatorData|llRequestURL|" +
        "llRequestUsername|llResetLandBanList|llResetLandPassList|llResetOtherScript|" +
        "llResetScript|llResetTime|llRezAtRoot|llRezObject|llRot2Angle|llRot2Axis|" +
        "llRot2Euler|llRot2Fwd|llRot2Left|llRot2Up|llRotateTexture|llRotBetween|" +
        "llRotLookAt|llRotTarget|llRotTargetRemove|llRound|llSameGroup|llSay|" +
        "llScaleTexture|llScriptDanger|llScriptProfiler|llSendRemoteData|llSensor|" +
        "llSensorRemove|llSensorRepeat|llSetAlpha|llSetAngularVelocity|llSetBuoyancy|" +
        "llSetCameraAtOffset|llSetCameraEyeOffset|llSetCameraParams|llSetClickAction|" +
        "llSetColor|llSetContentType|llSetDamage|llSetForce|llSetForceAndTorque|" +
        "llSetHoverHeight|llSetKeyframedMotion|llSetLinkAlpha|llSetLinkCamera|" +
        "llSetLinkColor|llSetLinkMedia|llSetLinkPrimitiveParams|" +
        "llSetLinkPrimitiveParamsFast|llSetLinkTexture|llSetLinkTextureAnim|" +
        "llSetLocalRot|llSetMemoryLimit|llSetObjectDesc|llSetObjectName|" +
        "llSetParcelMusicURL|llSetPayPrice|llSetPhysicsMaterial|llSetPos|" +
        "llSetPrimitiveParams|llSetPrimMediaParams|llSetRegionPos|" +
        "llSetRemoteScriptAccessPin|llSetRot|llSetScale|llSetScriptState|llSetSitText|" +
        "llSetSoundQueueing|llSetSoundRadius|llSetStatus|llSetText|llSetTexture|" +
        "llSetTextureAnim|llSetTimerEvent|llSetTorque|llSetTouchText|llSetVehicleFlags|" +
        "llSetVehicleFloatParam|llSetVehicleRotationParam|llSetVehicleType|" +
        "llSetVehicleVectorParam|llSetVelocity|llSHA1String|llShout|llSin|llSitTarget|" +
        "llSleep|llSqrt|llStartAnimation|llStopAnimation|llStopHover|llStopLookAt|" +
        "llStopMoveToTarget|llStopSound|llStringLength|llStringToBase64|llStringTrim|" +
        "llSubStringIndex|llTakeControls|llTan|llTarget|llTargetOmega|llTargetRemove|" +
        "llTeleportAgent|llTeleportAgentGlobalCoords|llTeleportAgentHome|llTextBox|" +
        "llToLower|llToUpper|llTransferLindenDollars|llTriggerSound|" +
        "llTriggerSoundLimited|llUnescapeURL|llUnSit|llVecDist|llVecMag|llVecNorm|" +
        "llVolumeDetect|llWater|llWhisper|llWind|llXorBase64StringsCorrect"
    );

    var keywordMapper = this.$keywords = this.createKeywordMapper({
        "keyword.control" : controlKeywords,
        "keyword.other" : keywords + "|" + events,
        "storage.type" : types,
        "constant.language": constants,
        "support.function": functions
    }, "identifier");

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
        "start" : [
            {
                token : "comment.line",
                regex : "\\/\\/.*$"
            }, {
                token : "comment.block", // multi line comment
                regex : "\\/\\*",
                next : "comment"
            }, {
                token : "string.double", // single line
                regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
            }, {
                token : "string.double", // multi line string start
                regex : '["].*$',
                next : "qqstring"
            }, {
                token : "constant.numeric", // hex
                regex : "0[xX][0-9a-fA-F]+\\b"
            }, {
                token : "constant.numeric", // float
                regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
            }, {
                token : keywordMapper,
                regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
            }, {
                token : "keyword.operator",
                regex : "!|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|==|=|!=|<=|>=|<|>|&&|\\|\\||\\*=|%=|\\+=|\\-="
            }, {
              token : "punctuation.operator",
              regex : "\\?|\\:|\\,|\\;|\\."
            }, {
                token : "paren.lparen",
                regex : "[[({]"
            }, {
                token : "paren.rparen",
                regex : "[\\])}]"
            }, {
                token : "text",
                regex : "\\s+"
            }
        ],
        "comment" : [
            {
                token : "comment.block", // closing comment
                regex : ".*?\\*\\/",
                next : "start"
            }, {
                token : "comment.block", // comment spanning whole line
                regex : ".+"
            }
        ],
        "qqstring" : [
            {
                token : "string.double",
                regex : '(?:(?:\\\\.)|(?:[^"\\\\]))*?"',
                next : "start"
            }, {
                token : "string.double",
                regex : '.+'
            }
        ]
    };
};

oop.inherits(lslHighlightRules, TextHighlightRules);

exports.lslHighlightRules = lslHighlightRules;
});
