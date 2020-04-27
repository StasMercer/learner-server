const AdminContent = require('../../models/AdminContent');
const checkAuth = require('../../utils/check-auth');

module.exports = {
    Query:{
        async getAdminContent(){
            try{
                return await AdminContent.find();
            }catch (e) {
                throw new Error(e)
            }
        },
        async getAdminContentById(_, {contentId}){
            const content = await AdminContent.findById(contentId);
            if(content){
                return content;
            }else{
                throw new Error('404');
            }
        }
    },

    Mutation:{
        async createAdminContent(_, {contentName}, context){
            const user = checkAuth(context);
            if (!user || user.role !== 'admin') throw new Error('not allowed');
            return await AdminContent.create({contentName, messages: []});
        },

        async removeAdminContent(_, {contentId}, context){
            const user = checkAuth(context);
            if (!user || user.role !== 'admin') throw new Error('not allowed');
            const deleted = await AdminContent.findByIdAndDelete(contentId);
            return await AdminContent.find();

        },

        async addMessage(_, {messageHeader, messageText, contentId}, context){
            const user = checkAuth(context);
            if (!user || user.role !== 'admin') throw new Error('not allowed');

            const content = await AdminContent.findById(contentId);
            if(!content) throw new Error('content not found');

            content.messages.push({messageHeader, messageText, createdAt: new Date().toISOString()})
            return await content.save();

        },

        async removeMessage(_, {messageIndex, contentId}, context){
            const user = checkAuth(context);
            if (!user || user.role !== 'admin') throw new Error('not allowed');

            const content = await AdminContent.findById(contentId);
            if(!content) throw new Error('content not found');

            content.messages.splice(messageIndex, 1);
            return await content.save();
        }

    }

}