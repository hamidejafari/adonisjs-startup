'use strict'

class ChatController {
    async inbox({view}){
        return view.render('admin.chat');
    }
}

module.exports = ChatController
