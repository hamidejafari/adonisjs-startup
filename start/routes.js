'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */


//use Route 
const Route = use('Route')
/*
const Redirect = use('App/Models/Redirect')

Route.group(async () => {
    let redirects = await Redirect.query().orderBy('id', 'desc').fetch();
    let redirec = redirects.toJSON();
    await Promise.all(redirec.map(async item => {
        Route.get(item.from_url,'Site/HomeController.redirect')
    }));
})
*/

Route.on('/sitemap.xml').render('site.sitemap').as('sitemap.sitemap')
Route.get('/sitemap','Site/HomeController.sitemap').as('site.sitemap')

Route.get('/create-conversations','Site/UtilsController.createConversations')
Route.get('/open-app-test','Site/UtilsController.openAppTest')

// Route.on('/sitemap-static.xml').render('site.sitemap-static').as('sitemap.sitemap-static')
// Route.get('/sitemap.xml','HomeController.sitemap').as('sitemap.sitemap')
// Route.get('/sitemap-article.xml','HomeController.sitemapArticle').as('sitemap.sitemap-article')

Route.get('/api/get-settings','Site/HomeController.getSettings')

Route.post('/api/forget-password','Site/HomeController.forgetPassword')
Route.post('/api/send-confirm-code','Site/HomeController.sendConfirmCode')
Route.post('/api/check-credit','Site/HomeController.checkCredit')

Route.get('/zarinpal-payment/:orderId','Site/ZarinpalController.startPayment')
Route.get('/zarinpal-finish-payment','Site/ZarinpalController.finishPayment')
Route.get('/mellat-payment/:orderId','Site/MellatController.startPayment')
Route.post('/mellat-finish-payment','Site/MellatController.finishPayment')
Route.get('/mobile-bank/:orderId','Site/MellatController.startPayment')
Route.post('/fcm-send','Site/FcmController.fcmSend')

Route.group(() => {
    Route.get('/','HomeController.getIndex').as('site.index')
    Route.get('/question','HomeController.question').as('site.question')
    //Ista Pages
    Route.on('/rules').render('site.rules').as('site.rules')
    Route.on('/about-us').render('site.about-us').as('site.about-us')
    Route.on('/profile/dashboard').render('site.profile.dashboard').as('site.profile.dashboard')
    Route.on('/profile/article/details').render('site.profile.article.details').as('site.profile.article.details')
    Route.on('/profile/article/list').render('site.profile.article.list').as('site.profile.article.list')
    Route.on('/download-app').render('site.download-app').as('site.download-app')
    Route.on('/legal-advice-application').render('site.legal-advice-application').as('site.legal-advice-application')

    //ContactUs 
    Route.on('/contact-us').render('site.contact-us').as('site.contact-us')
    Route.post('/contact-us/save','HomeController.saveContactUs').as('site.contact-us').validator('Contact')
    //Application 
    Route.get('/download-app','HomeController.downloadApp').as('site.download-app')
    Route.get('/application','HomeController.application').as('site.application')
    //Article & Article Category 
    Route.get('/articles/:id','HomeController.articles').as('site.articles')
    Route.get('/article-like/:id','HomeController.articleLike').as('site.article-like')
    Route.get('/article-category','HomeController.articleCategory').as('site.article-category')
    Route.get('/article-detail/:id','HomeController.articleDetail').as('site.article-detail')
    //News 
    Route.get('/news/','HomeController.news').as('site.news')
    Route.get('/news-detail/:id','HomeController.newsDetail').as('site.news-detail')
    //Accepts
    Route.get('/accept-lawyer','HomeController.acceptLawyer').as('site.accept-lawyer')
    Route.get('/accept-judgment','HomeController.acceptJudgment').as('site.accept-judgment')
    Route.get('/legal-management','HomeController.legalManagement').as('site.legal-management')    
    Route.post('/post-accept','HomeController.postAccept').as('site.post-accept').validator('AcceptLawyer')
    Route.post('/city-accept','HomeController.cityAccept').as('site.city-accept')
    //Advisers 
    Route.get('/advisers/:id','HomeController.advisers').as('site.advisers')
    Route.on('/persondetails').render('site.persondetails')

}).namespace('Site').middleware(['shareSite'])


Route.on('/webrtc').render('site.webrtc')
Route.on('/webrtc2').render('site.webrtc2')
Route.on('/news').render('site.news')
Route.on('/calendar').render('site.calendar')
Route.on('/details-blog').render('site.details-blog')
Route.on('/close-advisers').render('site.close-advisers')

//Route group for all the actions in "Admin Panel"👇 
Route.group(() => {
    Route.get('/','HomeController.dashboard').as('admin.dashboard')
    Route.get('/chat','ChatController.inbox').as('admin.chat')
    //Analytics
    Route.get('/analytics','HomeController.analytics').as('admin.analytics')
    Route.get('/resualt-analytics','HomeController.resualtAnalytics').as('admin.resualt-analytics')
    //Checkouts
    Route.get('/checkouts/list','CheckoutController.list').as('checkouts.list')
    Route.get('/checkouts/status/:id','CheckoutController.status').as('checkouts.status')
    //ChangedUsers
    Route.get('/changed-users/list','ChangedUsersController.list').as('changed-users.list')
    Route.get('/changed-users/change-status/:id','ChangedUsersController.changeStatus').as('changed-users.change-status')
    //CanceledEvents
    Route.get('/canceled-events/list','CanceldEventsController.list').as('canceled-events.list')
    Route.get('/canceled-events/accept/:id','CanceldEventsController.accept').as('canceled-events.accept')
    //Users
    Route.get('/users/list','UserController.list').as('users.list')
    Route.get('/users/create','UserController.create').as('users.create')
    Route.post('/users/post-create','UserController.postCreate').as('users.post-create')
    Route.get('/users/update/:id','UserController.update').as('users.update')
    Route.post('/users/post-update/:id','UserController.postUpdate').as('users.post-update')
    Route.get('/users/delete/:id', 'UserController.delete').as('users.delete')
    Route.get('/users/status/:id', 'UserController.status').as('users.status')
    Route.get('/users/vip/:id', 'UserController.vip').as('users.vip')
        // -> Rates
        Route.get('/rates/:id','RateController.list').as('rates.list')
    //Redirect
    Route.get('/redirect/list','RedirectController.list').as('redirect.list')
    Route.get('/redirect/create','RedirectController.create').as('redirect.create')
    Route.post('/redirect/post-create','RedirectController.postCreate').as('redirect.post-create')
    Route.get('/redirect/update/:id','RedirectController.update').as('redirect.update')
    Route.post('/redirect/post-update/:id','RedirectController.postUpdate').as('redirect.post-update')
    Route.get('/redirect/delete/:id', 'RedirectController.delete').as('redirect.delete')
    //Member
    Route.get('/member/list','MemberController.list').as('member.list') 
    Route.get('/member/create','MemberController.create').as('member.create')
    Route.post('/member/post-create','MemberController.postCreate').as('member.post-create')
    Route.get('/member/update/:id','MemberController.update').as('member.update')
    Route.post('/member/post-update/:id','MemberController.postUpdate').as('member.post-update')
    Route.get('/member/delete/:id', 'MemberController.delete').as('member.delete') 
    //Adviser
    Route.get('/adviser/list','AdviserController.list').as('adviser.list')
    Route.post('/adviser/click-state','AdviserController.clickState').as('adviser.click-state')
    Route.get('/adviser/files/:id','AdviserController.files').as('adviser.files')
    Route.get('/adviser/change-file-aprove/:id','AdviserController.changeFileAprove').as('adviser.change-file-aprove')
    Route.get('/adviser/create','AdviserController.create').as('adviser.create')
    Route.post('/adviser/post-create','AdviserController.postCreate').as('adviser.post-create')
    Route.get('/adviser/update/:id','AdviserController.update').as('adviser.update')
    Route.post('/adviser/post-update/:id','AdviserController.postUpdate').as('adviser.post-update')
    Route.get('/adviser/status/:id', 'AdviserController.status').as('adviser.status')
    Route.get('/adviser/allow-work/:id', 'AdviserController.allowWork').as('adviser.allow-work')
    Route.get('/adviser/vip/:id', 'AdviserController.vip').as('adviser.vip')
    Route.get('/adviser/confirm-image/:id', 'AdviserController.confirmImage').as('adviser.confirm-image')
    Route.get('/adviser/map/:id', 'AdviserController.map').as('adviser.map')
    Route.post('/adviser/destroy/','AdviserController.destroy').as('adviser.destroy')
        // -> Expertises 
        Route.get('/adviser/expertises/:id','AdviserController.expertises').as('adviser.expertises')
        Route.get('/adviser/expertises/delete/:userId/:expertiseId','AdviserController.deleteExpertise').as('adviser.expertises.delete')
        Route.post('/adviser/expertises/add/','AdviserController.addExpertise').as('adviser.expertises.add')
    //Tags 
    Route.get('/tags/','TagController.viewShow').as('tags.list')
    Route.post('/tags/destroy/','TagController.destroy').as('tags.destroy')
    //Fields 
    Route.get('/fields/','FieldController.viewShow').as('fields.list')
    Route.post('/fields/destroy/','FieldController.destroy').as('fields.destroy')
    //News 
    Route.get('/news/list','NewsController.list').as('news.list')
    Route.get('/news/create','NewsController.create').as('news.create')
    Route.post('/news/save-create','NewsController.saveCreate').as('news.save-create')
    Route.get('/news/update/:id','NewsController.update').as('news.update')
    Route.post('/news/save-update/:id','NewsController.saveUpdate').as('news.save-update')
    Route.get('/news/delete/:id','NewsController.delete').as('news.delete')
    Route.post('/news/destroy/','NewsController.destroy').as('news.destroy')
    //Order 
    Route.get('/orders/list','OrderController.list').as('order.list')
    Route.get('/orders/detail/:id','OrderController.detail').as('order.detail')
    //EventRequest 
    Route.get('/event-request/list','EventRequestController.list').as('event-request.list')
    Route.get('/event-request/delete/:id','EventRequestController.delete').as('event-request.delete')
    Route.post('/event-request/destroy/','EventRequestController.destroy').as('event-request.destroy')
    //Accept 
    Route.get('/accept/list','AcceptController.list').as('accept.list')
    Route.get('/accept/read/:id','AcceptController.read').as('accept.read')
    //Expertise 
    Route.get('/expertise/list/:type','ExpertiseController.list').as('expertise.list')
    Route.get('/expertise/create/:type','ExpertiseController.create').as('expertise.create')
    Route.post('/expertise/save-create','ExpertiseController.saveCreate').as('expertise.save-create')
    Route.get('/expertise/update/:id/:type','ExpertiseController.update').as('expertise.update')
    Route.post('/expertise/save-update/:id','ExpertiseController.saveUpdate').as('expertise.save-update')
    Route.get('/expertise/delete/:id/','ExpertiseController.delete').as('expertise.delete')
    Route.post('/expertise/destroy/','ExpertiseController.destroy').as('expertise.destroy')
    //Record 
    Route.get('/record/list/','RecordController.list').as('record.list')
    Route.get('/record/status/:id','RecordController.status').as('record.status')
    //File 
    Route.get('/file/list/','FileController.list').as('file.list')
    Route.post('/file/destroy/','FileController.destroy').as('file.destroy')
    Route.post('/file/save-create','FileController.saveCreate').as('file.save-create')
    //Uploader 
    Route.get('/uploader/list','UploaderController.list').as('uploader.list')
    Route.post('/uploader/save-create','UploaderController.saveCreate').as('uploader.save-create')
    Route.get('/uploader/delete/:id','UploaderController.delete').as('uploader.delete')
    Route.post('/uploader/destroy/','UploaderController.destroy').as('uploader.destroy')
    //Social 
    Route.get('/social/list','SocialController.list').as('social.list')
    Route.get('/social/create','SocialController.create').as('social.create')
    Route.post('/social/save-create','SocialController.saveCreate').as('social.save-create')
    Route.get('/social/update/:id','SocialController.update').as('social.update')
    Route.post('/social/save-update/:id','SocialController.saveUpdate').as('social.save-update')
    Route.get('/social/delete/:id','SocialController.delete').as('social.delete')
    Route.post('/social/destroy/','SocialController.destroy').as('social.destroy')
    //Multi Media 
    Route.get('/multi-media/list','MultiMediaController.list').as('multi-media.list')
    Route.get('/multi-media/create','MultiMediaController.create').as('multi-media.create')
    Route.post('/multi-media/save-create','MultiMediaController.saveCreate').as('multi-media.save-create')
    Route.get('/multi-media/update/:id','MultiMediaController.update').as('multi-media.update')
    Route.post('/multi-media/save-update/:id','MultiMediaController.saveUpdate').as('multi-media.save-update')
    Route.get('/multi-media/delete/:id','MultiMediaController.delete').as('multi-media.delete')
    Route.post('/multi-media/destroy/','MultiMediaController.destroy').as('multi-media.destroy')
    //Slider 
    Route.get('/slider/list','SliderController.list').as('slider.list')
    Route.get('/slider/create','SliderController.create').as('slider.create')
    Route.post('/slider/save-create','SliderController.saveCreate').as('slider.save-create')
    Route.get('/slider/update/:id','SliderController.update').as('slider.update')
    Route.post('/slider/save-update/:id','SliderController.saveUpdate').as('slider.save-update')
    Route.get('/slider/delete/:id','SliderController.delete').as('slider.delete')
    Route.post('/slider/destroy/','SliderController.destroy').as('slider.destroy')
    //Transactions 
    Route.get('/transaction/list','TransactionController.list').as('transaction.list')
    //OffCode 
    Route.get('/off-code/list','OffCodeController.list').as('off-code.list')
    Route.get('/off-code/create','OffCodeController.create').as('off-code.create')
    Route.post('/off-code/store','OffCodeController.store').as('off-code.store')
    Route.get('/off-code/update/:id','OffCodeController.update').as('off-code.update')
    Route.post('/off-code/edit','OffCodeController.edit').as('off-code.edit')
    Route.get('/off-code/delete/:id','OffCodeController.delete').as('off-code.delete')
    //Plan 
    Route.get('/plan/list','PlanController.list').as('plan.list')
    Route.get('/plan/create','PlanController.create').as('plan.create')
    Route.post('/plan/store','PlanController.store').as('plan.store')
    Route.get('/plan/update/:id','PlanController.update').as('plan.update')
    Route.post('/plan/edit','PlanController.edit').as('plan.edit')
    Route.get('/plan/delete/:id','PlanController.delete').as('plan.delete')
    //QuestionCategory 
    Route.get('/question-category/list','QuestionCategoryController.list').as('question-category.list')
    Route.post('/question-category/store','QuestionCategoryController.store').as('question-category.store')
    Route.post('/question-category/edit','QuestionCategoryController.edit').as('question-category.edit')
    Route.get('/question-category/delete/:id','QuestionCategoryController.delete').as('question-category.delete')
    //Question
    Route.get('/question/list','QuestionController.list').as('question.list')
    Route.get('/question/create','QuestionController.create').as('question.create')
    Route.post('/question/store','QuestionController.store').as('question.store')
    Route.get('/question/update/:id','QuestionController.update').as('question.update')
    Route.post('/question/edit','QuestionController.edit').as('question.edit')
    Route.post('/question/destroy/','QuestionController.destroy').as('question.destroy')
    //ArticleCategory     
    Route.get('/article-category/list','ArticleCategoryController.list').as('article-category.list')
    Route.post('/article-category/store','ArticleCategoryController.store').as('article-category.store')
    Route.post('/article-category/edit','ArticleCategoryController.edit').as('article-category.edit')
    Route.get('/article-category/delete/:id','ArticleCategoryController.delete').as('article-category.delete')
    Route.post('/article-category/destroy/','ArticleCategoryController.destroy').as('article-category.destroy')
    //Article 
    Route.get('/article/list','ArticleController.list').as('article.list')
    Route.get('/article/create','ArticleController.create').as('article.create')
    Route.post('/article/store','ArticleController.store').as('article.store')
    Route.get('/article/update/:id','ArticleController.update').as('article.update')
    Route.post('/article/edit/:id','ArticleController.edit').as('article.edit')
    Route.get('/article/delete/:id','ArticleController.delete').as('article.delete')
    Route.post('/article/destroy/','ArticleController.destroy').as('article.destroy')
    //PageCategory     
    Route.get('/page-category/list','PageCategoryController.list').as('page-category.list')
    Route.post('/page-category/store','PageCategoryController.store').as('page-category.store')
    Route.post('/page-category/edit','PageCategoryController.edit').as('page-category.edit')
    Route.get('/page-category/delete/:id','PageCategoryController.delete').as('page-category.delete')
    Route.post('/page-category/destroy/','PageCategoryController.destroy').as('page-category.destroy')
    //Page 
    Route.get('/page/list','PageController.list').as('page.list')
    Route.get('/page/create','PageController.create').as('page.create')
    Route.post('/page/store','PageController.store').as('page.store')
    Route.get('/page/update/:id','PageController.update').as('page.update')
    Route.post('/page/edit/:id','PageController.edit').as('page.edit')
    Route.get('/page/delete/:id','PageController.delete').as('page.delete')
    Route.post('/page/destroy/','PageController.destroy').as('page.destroy')
    //Setting 
    Route.get('/setting/edit','SettingController.edit').as('setting.edit')
    Route.post('/setting/edit-save','SettingController.editSave').as('setting.edit-save')
    //Events 
    Route.get('/event/list','EventController.list').as('event.list')
    Route.post('/event/redirect','EventController.redirect').as('event.redirect')
    Route.get('/event/allow/:id','EventController.allow').as('event.allow')
    Route.get('/event/reserved/:id','EventController.reserved').as('event.reserved')
    //Message
    Route.get('/message/chat-view/:id','MessageController.chatView').as('message.chat-view')
    //Ticket
    Route.get('/ticket/list','TicketController.list').as('ticket.list')
    Route.get('/ticket/close/:id','TicketController.close').as('ticket.close')
    Route.get('/ticket/reply/:id','TicketController.reply').as('ticket.reply')
    Route.post('/ticket/post-reply/','TicketController.postReply').as('ticket.post-reply')
    Route.post('/ticket/destroy/','TicketController.destroy').as('ticket.destroy')
    Route.get('/ticket/new-ticket/:id','TicketController.newTicket').as('ticket.new-ticket')
    Route.post('/ticket/save-new-ticket/','TicketController.saveNewTicket').as('ticket.save-new-ticket')
    Route.post('/ticket/save-new-ticket-adviser/','TicketController.saveNewTicketAdviser').as('ticket.save-new-ticket-adviser')

    //ContactUs 
    Route.get('/contact-us/list','ContactUsController.list').as('contact-us.list')
    Route.get('/contact-us/read/:id','ContactUsController.read').as('contact-us.read')    
    //RecordType 
    //Route.get('/record-type/','RecordTypeController.viewShow').as('record-type.list')

    //RecordType 
    Route.get('/record-type/list','RecordTypeController.list').as('record-type.list')
    Route.get('/record-type/create','RecordTypeController.create').as('record-type.create')
    Route.post('/record-type/store','RecordTypeController.store').as('record-type.store')
    Route.get('/record-type/update/:id','RecordTypeController.update').as('record-type.update')
    Route.post('/record-type/edit/:id','RecordTypeController.edit').as('record-type.edit')
    Route.post('/record-type/destroy/','RecordTypeController.destroy').as('record-type.destroy')
    //Department 
    Route.get('/department/list','DepartmentController.list').as('department.list')
    Route.get('/department/create','DepartmentController.create').as('department.create')
    Route.post('/department/store','DepartmentController.store').as('department.store')
    Route.get('/department/update/:id','DepartmentController.update').as('department.update')
    Route.post('/department/edit/:id','DepartmentController.edit').as('department.edit')
    Route.post('/department/destroy/','DepartmentController.destroy').as('department.destroy')
}).namespace('Admin').middleware(['authCustom'],['share']).prefix('admin')

//Route group for Api Vuejs👇
Route.group(() => {
    //Tags Vuejs Api 🏷 
    Route.post('/tags/list','TagController.list').as('tags.list')
    Route.post('/tags/change','TagController.change').as('tags.change')
    Route.post('/tags/create','TagController.create').as('tags.create')
    Route.post('/tags/delete','TagController.delete').as('tags.delete')
    Route.post('/tags/search','TagController.search').as('tags.search')
    //Fields Vuejs Api 🏷 
    Route.post('/fields/list','FieldController.list').as('fields.list')
    Route.post('/fields/change','FieldController.change').as('fields.change')
    Route.post('/fields/create','FieldController.create').as('fields.create')
    Route.post('/fields/delete','FieldController.delete').as('fields.delete')
    Route.post('/fields/search','FieldController.search').as('fields.search')
    //Department Vuejs Api 
    // Route.post('/department/list','DepartmentController.list').as('department.list')
    // Route.post('/department/change','DepartmentController.change').as('department.change')
    // Route.post('/department/create','DepartmentController.create').as('department.create')
    // Route.post('/department/delete','DepartmentController.delete').as('department.delete')
    // Route.post('/department/search','DepartmentController.search').as('department.search')
    //RecordType Vuejs Api 
    //Route.post('/record-type/list','RecordTypeController.list').as('record-type.list')
    //Route.post('/record-type/change','RecordTypeController.change').as('record-type.change')
    //Route.post('/record-type/create','RecordTypeController.create').as('record-type.create')
    //Route.post('/record-type/delete','RecordTypeController.delete').as('record-type.delete')
    //Route.post('/record-type/search','RecordTypeController.search').as('record-type.search')
}).namespace('Admin').middleware(['authCustom'],['share'])


//I have 2 route group .. cause i dont need auth middleware for "Login/Logout"
//Route group for "AdminAuthentication"👇
Route.group(() => {
    Route.get('/login','AuthController.login').as('auth.login')
    Route.post('/post-login','AuthController.postLogin').as('auth.post-login').validator('Login')
    Route.get('/logout', async ({ auth, response }) => {
        await auth.logout();
        return response.redirect('/');
    }).as('auth.logout')
}).namespace('Admin').prefix('admin')





