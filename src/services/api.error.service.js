import messages from '@/statics/messages'
import eventBus from "../utils/event.bus";
import i18n from "../i18n"
// import store from "@/store";
const ApiErrorService = {
  detectError: async function (error) {
    if (error?.errorCodeLists && error?.errorCodeLists?.length > 0 || error?.data?.errorCodeLists && error?.data?.errorCodeLists?.length > 0) {
      let errors = []
      if (error?.errorCodeLists && error?.errorCodeLists?.length > 0){
         errors = error.errorCodeLists
      }else if (error?.data?.errorCodeLists && error?.data?.errorCodeLists?.length > 0) {
         errors = error.data.errorCodeLists
      }
      for (let i = 0; i < errors.length; i++) {
        switch (errors[i]) {
          case 19:
            eventBus.emit('notification', {
              title: 'ظرفیت تکمیل',
              type: 'error',
              bodyText: i18n.global.t('link_is_incorrect'),
              time: 5000

            })
            break
          case 21:
            eventBus.emit('notification', {
              title: 'ظرفیت تکمیل',
              type: 'error',
              bodyText: i18n.global.t('capacity_is_full'),
              time: 5000

            })
            break
          case 100:
            eventBus.emit('notification',{
              type: 'warning',
              title: 'warning',

              time: 7000
            })
            break
          case 101:
            eventBus.emit('notification',{
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('empty_end_time'),
              time: 7000
            })
            break
          case 102:
            eventBus.emit('notification',{
              type: 'warning',
              title: 'warning',
              text: i18n.global.t('no_room_selected'),
              time: 7000
            })
            break
          case 103:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('no_subject_selected'),
              time: 7000
            })
            break
          case 104:
            eventBus.emit('notification',{
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('empty_moderator'),
              time: 7000
            })
            break
          case 105:
            eventBus.emit('notification',{
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('empty_subsituation'),
              time: 7000
            })
            break
          case 106:
            eventBus.emit('notification',{
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('empty_informing_type'),
              time: 7000
            })
            break
          case 107:
            eventBus.emit('notification',{
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('wrong_time_format'),
              time: 7000
            })
            break
          case 108:
            eventBus.emit('notification',{
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('min_meeting_time'),
              time: 7000
            })
            break
          case 109:
            eventBus.emit('notification',{
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('max_meeting_time'),
              time: 7000
            })
            break
          case 110:
            eventBus.emit('notification',{
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('conflict_room'),
              time: 7000
            })
            break
          case 111:
            eventBus.emit('notification',{
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('moderator_selected_before'),
              time: 7000
            })
            break
          case 112:
            eventBus.emit('notification',{
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('moderator_selected_before'),
              time: 7000
            })
            break
          case 113:
            eventBus.emit('notification',{
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('moderator_not_belong'),
              time: 7000
            })
            break
          case 114:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('room_not_belong'),
              time: 7000
            })
            break
          case 115:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('end_bigger_than_start'),
              time: 7000
            })
            break
          case 116:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('start_time_in_less_than_now'),
              time: 7000
            })
            break
          case 117:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('meeting_time_has_ended'),
              time: 7000
            })
            break
          case 118:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText:  i18n.global.t('cant_edit'),
              time: 7000
            })
            break
          case 119:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('cant_change_moderator_during_meeting'),
              time: 7000
            })
            break
          case 120:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('cant_change_meeting_name'),
              time: 7000
            })
            break
          case 121:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('"cant_change_meeting_start_time":'),
              time: 7000
            })
            break
          case 122:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('empty_start_time'),
              time: 7000
            })
            break
          case 123:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('empty_end_time'),
              time: 7000
            })
            break
          case 124:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('no_room_selected'),
              time: 7000
            })
            break
          case 125:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('no_subject_selected'),
              time: 7000
            })
            break
          case 126:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('empty_moderator'),
              time: 7000
            })
            break
          case 127:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('empty_subsituation'),
              time: 7000
            })
            break
          case 128:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('empty_informing_type'),
              time: 7000
            })
            break
          case 129:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('wrong_time_format'),
              time: 7000
            })
            break
          case 130:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('min_meeting_time'),
              time: 7000
            })
            break
          case 131:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('max_meeting_time'),
              time: 7000
            })
            break
          case 132:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('conflict_room'),
              time: 7000
            })
            break
          case 133:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('moderator_selected_before'),
              time: 7000
            })
            break
          case 134:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('moderator_selected_before'),
              time: 7000
            })
            break
          case 135:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('no_subject_selected'),
              time: 7000
            })
            break
          case 136:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('moderator_not_belong'),
              time: 7000
            })
            break
          case 137:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('end_bigger_than_start'),
              time: 7000
            })
            break
          case 138:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('start_time_in_less_than_now'),
              time: 7000
            })
            break
          case 139:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('meeting_room_is_not_changable'),
              time: 7000
            })
            break
          case 140:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('secretury_wants_add_member_to_meeting_wich_didnt_created'),
              time: 7000
            })
            break
          case 141:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('cant_cancel_meeting'),
              time: 7000
            })
            break
          case 142:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('cant_cancel_meeting'),
              time: 7000
            })
            break
          case 143:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('should_remove_members_before_deleting_meeting'),
              time: 7000
            })
            break
          case 144:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('cant_cancel_meeting'),
              time: 7000
            })
            break
          case 145:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('meeting_has_ended_and_you_cant_invite'),
              time: 7000
            })
            break
          case 146:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('invited_members_are_more_than_capacity'),
              time: 7000
            })
            break
          case 147:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('moderator_invited_before'),
              time: 7000
            })
            break
          case 148:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('subsituation_invited_before'),
              time: 7000
            })
            break
          case 149:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('invite_users_from_another_organization'),
              time: 7000
            })
            break
          case 150:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('invite_users_from_another_organization'),
              time: 7000
            })
            break
          case 151:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('no-access-required'),
              time: 7000
            })
            break
          case 152:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('no-access-required'),
              time: 7000
            })
            break
          case 160:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('user_already_invited'),
              time: 7000
            })
            break
          case 161:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText: i18n.global.t('user_already_invited'),
              time: 7000
            })
            break
          case 162:
            eventBus.emit('notification', {
              type: 'warning',
              title: 'warning',
              bodyText:  i18n.global.t('the-number-of-images-should-be-between-4-and-16'),
              time: 7000
            })
            break
          case 200:
            eventBus.emit('notification', {
              type: 'error',
              title: 'error',
              bodyText:  i18n.global.t('the-period-you-have-chosen-to-arrange-a-meeting-in-this-room-is-outside-of-your-contract-time'),
              time: 7000
            })
            break

          case 201:
            eventBus.emit('notification', {
              type: 'error',
              title: 'error',
              bodyText:  i18n.global.t('you-have-already-created-a-room-with-the-same-name'),
              time: 7000
            })
            break
          case 204:
            eventBus.emit('notification', {
              type: 'error',
              title: 'error',
              bodyText:  i18n.global.t('passwords_not_matches'),
              time: 3000
            })
            break
          case 205:
            eventBus.emit('notification', {
              type: 'error',
              title: 'error',
              bodyText:  i18n.global.t('phone-number-is-empty'),
              time: 7000
            })
            break
          case 203:
            eventBus.emit('notification', {
              type: 'error',
              title: 'error',
              bodyText:  i18n.global.t('the-password-field-cannot-be-empty'),
              time: 7000
            })
            break
          case 206:
            eventBus.emit('notification', {
              type: 'error',
              title: 'error',
              bodyText:  i18n.global.t('the-email-field-cannot-be-empty'),
              time: 7000
            })
            break
          case 209:
            eventBus.emit('notification', {
              type: 'error',
              title: 'error',
              bodyText:  i18n.global.t('incorrect_character_for_familyname_field'),
              time: 7000
            })
            break
          case 208:
            eventBus.emit('notification', {
              type: 'error',
              title: 'error',
              bodyText:  i18n.global.t('familyname_character_is_more_than_standard'),
              time: 7000
            })
            break
          case 207:
            eventBus.emit('notification', {
              type: 'error',
              title: 'error',
              bodyText:  i18n.global.t('username_character_is_more_than_standard'),
              time: 7000
            })
                break
          case 210:
            eventBus.emit('notification', {
              type: 'error',
              title: 'error',
              bodyText:  i18n.global.t('incorrect_character_for_familyname_field'),
              time: 7000
            })
                break
          case 211:
            eventBus.emit('notification', {
              type: 'error',
              title: 'error',
              bodyText:  i18n.global.t('username_already_exist'),
              time: 7000
            })
            break
          case 212:
            eventBus.emit('notification', {
              type: 'error',
              title: 'error',
              bodyText:  i18n.global.t('invalid_email_format'),
              time: 7000
            })
            break
          case 213:
            eventBus.emit('notification', {
              type: 'error',
              title: 'error',
              bodyText:  i18n.global.t('email_already_exist'),
              time: 7000
            })
            break
          case 214:
            eventBus.emit('notification', {
              type: 'error',
              title: 'error',
              bodyText:  i18n.global.t('invalid_mobile_number'),
              time: 7000
            })
            break
          case 215:
            eventBus.emit('notification', {
              type: 'error',
              title: 'error',
              bodyText:  i18n.global.t('mobile_number_already_exist'),
              time: 7000
            })
            break
          case 216:
            eventBus.emit('notification', {
              type: 'error',
              title: 'error',
              bodyText:  i18n.global.t('min_char_for_password'),
              time: 7000
            })
            break
          case 217:
            eventBus.emit('notification', {
              type: 'error',
              title: 'error',
              bodyText:  i18n.global.t('max_char_for_password'),
              time: 7000
            })
            break
          case 218:
            eventBus.emit('notification', {
              type: 'error',
              title: 'error',
              bodyText:  i18n.global.t('invalid_password_format'),
              time: 7000
            })
            break
          case 306:
            eventBus.emit('notification', {
              title: 'عدم ثبت ایمیل',
              type: 'error',
              bodyText: messages.email_not_exist_in_database,
              time: 3000

            })
            break
          case 307:
            eventBus.emit('notification', {
              title: 'ایمیل',
              type: 'error',
              bodyText: messages.empty_email,
              time: 3000


            })

            break
          case 309:
            eventBus.emit('notification', {
              title: 'کد',
              type: 'error',
              bodyText: messages.code_expired,
              time: 3000

            })
            break
          case 311:
            eventBus.emit('notification', {
              title: 'کد',
              type: 'error',
              bodyText: messages.wrong_code,
              time: 3000

            })
            break
          case 314:
            eventBus.emit('notification', {
              title: 'کد',
              type: 'error',
              bodyText: i18n.global.t('ldap_group_empty'),
              time: 3000

            })
            break
          case 10:
            eventBus.emit('notification', {
              title: 'اتاق غیر فعال',
              type: 'error',
              bodyText: messages.room_deactivated,
              time: 3000

            })
            break
          case 11:

            eventBus.emit('notification', {
              title: 'پسورد اشتباه',
              type: 'error',
              bodyText: messages.password_incorrect,
              time: 3000

            })
            break
          case 12:
            eventBus.emit('notification', {
              title: 'ظرفیت تکمیل',
              type: 'error',
              bodyText: messages.capacity_is_full,
              time: 3000
            })
            eventBus.emit('leave-conference')
            break
          case 13:
            eventBus.emit('notification', {
              title: 'پیام',
              type: 'warning',
              bodyText: messages.meeting_not_started_yet,
              time: 3000

            })
            break
          case 14:
            eventBus.emit('notification', {
              title: 'پیام',
              type: 'error',
              bodyText: messages.meeting_not_started_yet,
              time: 3000

            })
            break
          case 15:
            eventBus.emit('user_already_exist_in_meeting')
            eventBus.emit('notification', {
              title: 'پیام',
              type: 'error',
              bodyText: i18n.global.t('user_already_exist_in_meeting'),
              time: 5000
            })
            break
          // case 17:
          //   eventBus.emit('notification', {
          //     title: 'پیام',
          //     type: 'error',
          //     bodyText: this.$store.getters.t('invalid-room-password'),
          //     time: 3000
          //
          //   })
          //   break

          case 504:
            eventBus.emit('notification', {
              title: 'پیام',
              type: 'error',
              bodyText: i18n.global.t('authentication-code'),
              time: 7000

            })

            break
          case 707:
            eventBus.emit('notification', {
              title: 'پیام',
              type: 'error',
              bodyText: i18n.global.t('no-survey-has-been-conducted'),
              time: 3000

            })

            break
          // case 718:
          //   eventBus.emit('notification', {
          //     title: 'پیام',
          //     type: 'error',
          //     bodyText: this.$store.getters.t("private_room_deactivated"),
          //     time: 3000
          //
          //   })
          //
          //   break
          case 720:
            eventBus.emit('notification', {
              title: 'پیام',
              type: 'error',
              bodyText: this.$store.getters.t("capacity_is_full_private_room"),
              time: 3000

            })
            break
          // case 722:
          //   eventBus.emit('notification', {
          //     title: 'پیام',
          //     type: 'error',
          //     bodyText: this.$store.getters.t("wrong_private_room_password"),
          //     time: 3000
          //
          //   })
          //
          //   break
          case 723:
            eventBus.emit('notification', {
              title: 'پیام',
              type: 'error',
              bodyText: i18n.global.t('meeting_terminated'),
              time: 3000

            })
            break
          case 725:
            eventBus.emit('notification', {
              title: 'پیام',
              type: 'warning',
              bodyText: i18n.global.t('you-did-not-invite-anyone-to-the-room'),
              time: 3000

            })
            break
          case 729:
            eventBus.emit('notification', {
              title: 'پیام',
              type: 'error',
              bodyText: i18n.global.t('there-is-not-enough-capacity-for-this-number-of-participants'),
              time: 3000

            })
            break
          case 730:
            eventBus.emit('notification', {
              title: 'پیام',
              type: 'error',
              bodyText: i18n.global.t('the-name-of-the-room-is-empty'),
              time: 3000

            })
            break
          case 727:
            eventBus.emit('notification', {
              title: 'پیام',
              type: 'error',
              bodyText: i18n.global.t('the-room-capacity-is-full'),
              time: 3000

            })
            break
          case 731:
            eventBus.emit('notification', {
              title: 'پیام',
              type: 'error',
              bodyText: i18n.global.t('the-room-capacity-is-less-than-3'),
              time: 3000

            })
            break
          case 732:
            eventBus.emit('notification', {
              title: 'پیام',
              type: 'error',
              bodyText: i18n.global.t('the-room-name-is-duplicated'),
              time: 3000

            })
            break
          case 733:
            eventBus.emit('notification', {
              title: 'پیام',
              type: 'error',
              bodyText: i18n.global.t('the-number-of-images-entered-exceeds-the-limit'),
              time: 3000

            })
            break
          case 734:
            eventBus.emit('notification', {
              title: 'پیام',
              type: 'error',
              bodyText: i18n.global.t('the-maximum-number-of-logged-in-users-is-greater-than-the-limit'),
              time: 3000

            })
            break
          case 736:
            eventBus.emit('notification', {
              title: 'پیام',
              type: 'error',
              bodyText: i18n.global.t('the-minutes-number-is-already-used-please-change-it'),
              time: 5000

            })
            break
          case 737:
            eventBus.emit('notification', {
              title: 'پیام',
              type: 'error',
              bodyText: i18n.global.t('you-have-already-answered-this-survey'),
              time: 3000

            })
            break
          // case 911:
          //   eventBus.emit('notification', {
          //     title: 'پیام',
          //     type: 'error',
          //     bodyText: this.$store.getters.t("username_not_found"),
          //     time: 3000
          //
          //   })
          //   break
          case 912:
            eventBus.emit('notification', {
              title: 'پیام',
              type: 'error',
              bodyText: i18n.global.t('the-input-information-submitted-is-invalid'),
              time: 3000

            })
            break
          case 913:
            eventBus.emit('notification', {
              title: 'پیام',
              type: 'error',
              bodyText: i18n.global.t('the-input-information-submitted-is-invalid'),
              time: 5000

            })
            break
          case 914:
            eventBus.emit('notification', {
              title: 'پیام',
              type: 'error',
              bodyText: i18n.global.t('gender-not-found'),
              time: 5000

            })
            break
          case 10101:
            eventBus.emit('notification', {
              title: 'پیام',
              type: 'error',
              bodyText: i18n.global.t('unable-to-delete-vr-because-it-is-allocated-unallocate-first-and-try-again'),
              time: 3000

            })
            break
          case 10102:
            eventBus.emit('notification', {
              title: 'پیام',
              type: 'error',
              bodyText:i18n.global.t('the-maximum-number-of-allowed-lanes-has-not-been-observed'),
              time: 3000

            })
            break
          case 10103:
            eventBus.emit('notification', {
              title: 'پیام',
              type: 'error',
              bodyText:i18n.global.t('the-maximum-number-of-users-allowed-for-this-room-has-not-been-met'),
              time: 3000

            })
            break
          default:
            eventBus.emit('notification', {
              title: 'خطا',
              type: 'error',
              bodyText: i18n.global.t('error-occurred'),
              time: 3000

            })
            break
        }
      }
    }
  },
  showSuccess: function () {
    eventBus.emit('notification', {
      title: 'پیام',
      type: 'success',
      bodyText: messages.action_was_successfu,
      time: 3000

    })
  },
  accessDenied: function () {
    eventBus.emit('notification', {
      title: 'پیام',
      type: 'error',
      bodyText: messages.access_denied_403,
      time: 3000

    })
  },

  showTenantErrorMsg: function () {
    eventBus.emit('notification', {
      title: 'پیام',
      type: 'error',
      bodyText: messages.wrong_tenant,
      time: 3000

    })
  },
  showWrongUserPassErrorMsg: function () {
    eventBus.emit('notification', {
      title: 'پیام',
      type: 'error',
      bodyText: messages.usernameOrPasswordIncorrect,
      time: 3000

    })
  },
  serviceUnavailble: function () {
    eventBus.emit('notification', {
      title: 'پیام',
      type: 'error',
      bodyText: messages.service_unavailble_503,
      time: 3000

    })
  },
  tokenExpired: function () {
    eventBus.emit('notification', {
      title: 'پیام',
      type: 'error',
      bodyText: i18n.global.t('your-token-has-expired-Please-login-again'),
      time: 3000

    })

  }
}

export default ApiErrorService

export { ApiErrorService }
