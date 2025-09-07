import eventBus from "../../../utils/event.bus";


const participants = {
    state:{
        selected: ['همه'],
        displayedMessages: [],
        showChatList: true,
        chatList: [],
        displayedChatList: [],
        totalUnread: 0,
        isChatOpen: false
    },

    mutations:{
        SET_SELECTED: (state, userId) => {
            state.selected = userId
            state.displayedMessages = []
            for (let i = 0; i < state.chatList.length; i++) {
                if (state.selected === state.chatList[i].userId) {
                    state.displayedMessages = state.chatList[i].messages
                    state.totalUnread -= state.chatList[i].unreadCount
                    state.chatList[i].unreadCount = 0
                    return
                }
            }
        },
        ADD_TO_HISTORY: (state, newMessage) => {
            let userId = 'همه'
            let index = -1
            if (newMessage.messageType !== 'group') {
                userId = newMessage.userId
            }
            for (let i = 0; i < state.chatList.length; i++) {
                if (state.chatList[i].userId === userId) {
                    index = i
                    state.chatList[i].messages.push(newMessage)
                    // if chat is not open, add it to unread
                    if (!state.isChatOpen || (state.isChatOpen && state.selected !== userId)) {
                        state.chatList[i].unreadCount += 1
                        state.totalUnread++
                    }
                    break
                }
            }
            // moving new chat to top of the list
            state.chatList.splice(0, 0, state.chatList.splice(index, 1)[0])
        },
        ADD_TO_DISPLAYED: (state, newMessage) => {
            state.displayedMessages.push(newMessage)
        },
        SET_SHOW_CHAT_LIST: (state, showChatList) => {
            state.showChatList = showChatList
            if (showChatList) {
                state.displayedMessages = []
                state.selected = null
            }
        },
        SET_CHAT_LIST: (state, participants) => {
            const onlineParticipants = participants.filter(p => p.participantStatus === 'ONLINE');

            // Create a map to track existing users in the chat list
            const existingChatUsers = new Set(state.chatList.map(chat => chat.userId));

            // Create new chat entries for online participants
            const newChatEntries = onlineParticipants
                .filter(p => !existingChatUsers.has(p.userId)) // Only add users not already in the chat list
                .map(p => ({
                    userId: p.userId,
                    messages: [],
                    unreadCount: 0,
                    displayName: p.displayName,
                }));

            // Update chatList state by concatenating existing and new entries
            state.chatList = [...state.chatList, ...newChatEntries];

            // Update displayedChatList
            state.displayedChatList = state.chatList;
        },
        PARTICIPANT_JOINED_CHAT: (state, data) => {
            // Check if the user already exists in the chatList
            const userExists = state.chatList.some(chat => chat.userId === data.userId);

            if (!userExists) {
                state.chatList.push({
                    userId: data.userId,
                    messages: [],
                    unreadCount: 0,
                    displayName: data.displayName
                });
            }

            // Update displayed chat list
            state.displayedChatList = [...state.chatList];
            eventBus.emit('p-joined', state.displayedChatList);
        },

        MODERATOR_JOINED_CHAT: (state, data) => {
            // You can either call PARTICIPANT_JOINED_CHAT here or keep it separate
            const userExists = state.chatList.some(chat => chat.userId === data.userId);

            if (!userExists) {
                state.chatList.push({
                    userId: data.userId,
                    messages: [],
                    unreadCount: 0,
                    displayName: data.displayName
                });
            }

            // Update displayed chat list
            state.displayedChatList = [...state.chatList];
            eventBus.emit('p-joined', state.displayedChatList);
        },
        PARTICIPANT_LEFT: (state, data) => {
            const index = state.chatList.findIndex(item => item.userId === data.userId);

            if (index > -1) {
                // Remove the participant based on the found index
                state.chatList.splice(index, 1);

                // Update the displayedChatList to reflect this change
                state.displayedChatList = [...state.chatList];

                // Emit event for participant left
                eventBus.emit('p-left', state.displayedChatList);
            }
        },

        SET_IS_CHAT_OPEN: (state, isChatOpen) => {
            state.isChatOpen = isChatOpen;

            // Toggle chat panel visibility
            state.showChatList = !isChatOpen;

            // Update displayed chat list only if the chat is open
            if (isChatOpen) {
                state.displayedChatList = [...state.chatList];
            }
        },
    },

    actions:{
        setSelected({ commit }, userId) {
            commit('SET_SELECTED', userId)
        },
        addToHistory({ commit }, newMessage) {
            commit('ADD_TO_HISTORY', newMessage)
        },
        setshowChatList({ commit }, showChatList) {
            commit('SET_SHOW_CHAT_LIST', showChatList)
        },
        setChatList({ commit, rootGetters }, users) {
            // remove myself from chat list
            const index = users.findIndex(item => {
                return item.userId === rootGetters.userId
            })
            if (index > -1) {
                users.splice(index, 1)
            }
            commit('SET_CHAT_LIST', users)
        },
        participantJoinedForChatList({ commit }, data) {
            commit('PARTICIPANT_JOINED_CHAT', data)
        },
        moderatorJoinedForChatList({ commit }, data) {
            commit('MODERATOR_JOINED_CHAT', data)
        },

        participantLeftForChatList({ commit }, data) {
            commit('PARTICIPANT_LEFT', data)
        },
        setDisplayedChatList({ commit }, showChatList) {
            commit('SET_DISPLAYED_CHAT_LIST', showChatList)
        },
        setIsChatOpen({ commit }, isChatOpen) {
            commit('SET_IS_CHAT_OPEN', isChatOpen)
        }
    }
}
export default participants
