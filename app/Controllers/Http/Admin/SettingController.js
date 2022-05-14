'use strict'
const Setting = use('App/Models/Setting')
const Price = use('App/Models/Price')
const Helpers = use('Helpers')
const sharp = require('sharp')
const Drive = use('Drive')
class SettingController {
    async edit({ view}){
        const setting = await Setting.first();
        const price = await Price.query().orderBy('id','DESC').first();
        return view.render('admin.setting.edit',{
            setting  : setting,
            price  : price
        });
    }
    async editSave({  request , response , auth }){
        const setting = await Setting.first();
        const timeNow = new Date().getTime()
        if(request.file('logo_water_mark') != null){
            const logo_water_mark = request.file('logo_water_mark')
            await logo_water_mark.move(Helpers.publicPath('asset/admin/uploads/setting/main/'), {
                name: `${timeNow}.${logo_water_mark.extname}`
            })
            request.all().logo_water_mark = timeNow+'.'+logo_water_mark.extname
        }
        if(request.file('logo_footer') != null){
            const logo_footer = request.file('logo_footer')
            await logo_footer.move(Helpers.publicPath('asset/admin/uploads/setting/main/'), {
                name: `${timeNow}.${logo_footer.extname}`
            })
            request.all().logo_footer = timeNow+'.'+logo_footer.extname
        }
        if(request.file('logo_header') != null){
            const logo_header = request.file('logo_header')
            await logo_header.move(Helpers.publicPath('asset/admin/uploads/setting/main/'), {
                name: `${timeNow}.${logo_header.extname}`
            })
            request.all().logo_header = timeNow+'.'+logo_header.extname
        }
        if(request.file('logo_header_gallery') != null){
            const logo_header_gallery = request.file('logo_header_gallery')
            await logo_header_gallery.move(Helpers.publicPath('asset/admin/uploads/setting/main/'), {
                name: `${timeNow}.${logo_header_gallery.extname}`
            })
            request.all().logo_header_gallery = timeNow+'.'+logo_header_gallery.extname
        }
        if(request.file('favicon') != null){
            const favicon = request.file('favicon')
            await favicon.move(Helpers.publicPath('asset/admin/uploads/setting/main/'), {
                name: `${timeNow}.${favicon.extname}`
            })
            request.all().favicon = timeNow+'.'+favicon.extname
        }
        if(request.file('background_login') != null){
            const background_login = request.file('background_login')
            await background_login.move(Helpers.publicPath('asset/admin/uploads/setting/main/'), {
                name: `${timeNow}.${background_login.extname}`
            })
            request.all().background_login = timeNow+'.'+background_login.extname
        }
        if(request.file('logo_login') != null){
            const logo_login = request.file('logo_login')
            await logo_login.move(Helpers.publicPath('asset/admin/uploads/setting/main/'), {
                name: `${timeNow}.${logo_login.extname}`
            })
            request.all().logo_login = timeNow+'.'+logo_login.extname
        }
        if(request.file('not_found') != null){
            const not_found = request.file('not_found')
            await not_found.move(Helpers.publicPath('asset/admin/uploads/setting/main/'), {
                name: `${timeNow}.${not_found.extname}`
            })
            request.all().not_found = timeNow+'.'+not_found.extname
        }
        if(request.file('color2') != null){
            const color2 = request.file('color2')
            await color2.move(Helpers.publicPath('asset/admin/uploads/setting/main/'), {
                name: `${timeNow}.${color2.extname}`
            })
            request.all().color2 = timeNow+'.'+color2.extname
        }
        if(request.all().register == 'on'){
            request.all().register = 1;
        }else{
            request.all().register = 0;
        }
        if(request.all().shop == 'on'){
            request.all().shop = 1;
        }else{
            request.all().shop = 0;
        }
        if(request.all().enabled_article == 'on'){
            request.all().enabled_article = 1;
        }else{
            request.all().enabled_article = 0;
        }
        if(request.all().enabled_news == 'on'){
            request.all().enabled_news = 1;
        }else{
            request.all().enabled_news = 0;
        }
        if(request.all().enabled_adviser == 'on'){
            request.all().enabled_adviser = 1;
        }else{
            request.all().enabled_adviser = 0;
        }
        if(request.all().enabled_lawyer == 'on'){
            request.all().enabled_lawyer = 1;
        }else{
            request.all().enabled_lawyer = 0;
        }
        setting.title = request.all().title;
        setting.keyword = request.all().keyword;
        setting.description = request.all().description;
        setting.legal_advice_application = request.all().legal_advice_application;
        setting.logo_water_mark = request.all().logo_water_mark;
        setting.about_us_short = request.all().about_us_short;
        setting.favicon = request.all().favicon;
        setting.logo_header = request.all().logo_header;
        setting.logo_footer = request.all().logo_footer;
        setting.about_us = request.all().about_us;
        setting.logo_login = request.all().logo_login;
        setting.contact_us_short = request.all().contact_us_short;
        setting.contact_us = request.all().contact_us;
        setting.map = request.all().map;
        setting.text1 = request.all().text1;
        setting.text2 = request.all().text2;
        setting.background_login = request.all().background_login;
        setting.color1 = request.all().color1;
        setting.color2 = request.all().color2;
        setting.color3 = request.all().color3;
        setting.register = request.all().register;
        setting.shop = request.all().shop;
        setting.not_found = request.all().not_found;
        setting.price_chat = request.all().price_chat;
        setting.price_phone = request.all().price_phone;
        setting.price_face = request.all().price_face;
        setting.phone1 = request.all().phone1;
        setting.phone2 = request.all().phone2;
        setting.phone3 = request.all().phone3;
        setting.email = request.all().email;
        setting.address = request.all().address;
        setting.enabled_lawyer = request.all().enabled_lawyer;
        setting.enabled_adviser = request.all().enabled_adviser;
        setting.enabled_news = request.all().enabled_news;
        setting.enabled_article = request.all().enabled_article;
        setting.contract = request.all().contract;
        setting.enabled_accept = request.all().enabled_accept;
        setting.judgment = request.all().judgment;
        setting.lawyer = request.all().lawyer;
        setting.management = request.all().management;
        setting.apk_count = request.all().apk_count;
        setting.store_link = request.all().store_link;
        setting.apk_count_missjafari = request.all().apk_count_missjafari;
        await setting.save();
        const price = await Price.query().orderBy('id','DESC').first();

        if(price.chat_price  != request.all().chat_price || price.call_price != request.all().call_price || price.face_price != request.all().face_price || price.off_user != request.all().off_user || price.off_adviser != request.all().off_adviser){
            const admin = await auth.getUser()
            request.all().admin_id = admin.id
            const price_create = await Price.create(request.only([
                'chat_price',
                'call_price',
                'face_price',
                'off_user',
                'off_adviser',
                'admin_id'
            ]));
        }

        return response.redirect('/admin/setting/edit');
    }
}

module.exports = SettingController
