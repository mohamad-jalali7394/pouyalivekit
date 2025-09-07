import Auth from './auth'
import ScheduledMeeting from './scheduledMeeting'
import User from './user'
import Invite from './invite'
import ControlMeeting from './controlMeeting'
import Group from './group'
import PrivateRoom from './privateRoom'
import UserGroup from './userGroup'
import PassProtection from './passProtection'
import entityTypes from '@/statics/entityTypes'
import Poll from './polling'
import Proceedings from './proceedings'
import room from "./room";
import Billing from './billing'
import Report from "./report";
import Log from './log'
import Ldap from './ldap'
import MeetingAttribute from './meetingAttribute'
import Setting from './setting'
import Agenda from './agenda'
import Customer from './customer'
class RestClient {
  constructor(type) {
    switch (type) {
      case entityTypes.polling:
        return new Poll()
      case entityTypes.auth:
        return new Auth()
      case entityTypes.scheduledMeeting:
        return new ScheduledMeeting()
      case entityTypes.user:
        return new User()
      case entityTypes.invite:
        return new Invite()
      case entityTypes.controlMeeting:
        return new ControlMeeting()
      case entityTypes.group:
        return new Group()
      case entityTypes.privateRoom:
        return new PrivateRoom()
      case entityTypes.userGroup:
        return new UserGroup()
      case entityTypes.passProtection:
        return new PassProtection()
      case entityTypes.proceedings:
        return new Proceedings()
      case entityTypes.room:
        return new room()
      case entityTypes.billing:
        return new Billing()
      case entityTypes.report:
        return new Report()
      case entityTypes.log:
        return new Log()
      case entityTypes.ldap:
        return new Ldap()
      case entityTypes.meetingAttribute:
        return new MeetingAttribute()
      case entityTypes.setting:
        return new Setting()
      case entityTypes.agenda:
        return new Agenda()
      case entityTypes.customer:
        return new Customer()
    }
  }
}

export default RestClient
