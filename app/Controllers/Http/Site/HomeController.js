'use strict'
 
const User = use('App/Models/User')
const ApplicationDownloads = use('App/Models/ApplicationDownloads')
const Article = use('App/Models/Article')
const State = use('App/Models/State')
const City = use('App/Models/City')
const Content = use('App/Models/Content')
const ArticleLike = use('App/Models/ArticleLike')
const ArticleCategory = use('App/Models/ArticleCategory')
const Helpers = use('Helpers')
const QuestionCategory = use('App/Models/QuestionCategory')
const Question = use('App/Models/Question')
const Transaction = use('App/Models/Transaction')
const Order = use('App/Models/Order')
const ContactUs = use('App/Models/ContactUs')
const Ticket = use('App/Models/Ticket')
const Setting = use('App/Models/Setting')
const Record = use('App/Models/Record')
const Expertise = use('App/Models/Expertise')
const Accept = use('App/Models/Accept')
const Hash = use('Hash')
const axios = require('axios')
const Reidrect = use('App/Models/Redirect')
const { SitemapStream, streamToPromise } = require('../../../../node_modules/sitemap/dist/index')
const fs = require('fs');
const Kavenegar = require('kavenegar');

class HomeController {
	   async sitemap({ view , response}) {

        const sitemap = new SitemapStream({ hostname: 'http://animoshaver.ir' });
        const articles = await Article.query().orderBy('id', 'desc').fetch();
        const finalArticles = articles.toJSON();
        await  Promise.all(finalArticles.map(async item => {
            console.log(item)
            if(item.seo_url == null || item.seo_url == 'undefined'){
                sitemap.write({ url: 'article-detail/'+item.id, changefreq: 'weekly', priority: 0.8 })
            }else{
                sitemap.write({ url: 'article/'+item.seo_url, changefreq: 'weekly', priority: 0.8 })
            }
        }));

        const articleCategories = await ArticleCategory.query().orderBy('id', 'desc').fetch();
        const finalArticleCategories = articleCategories.toJSON();
        await  Promise.all(finalArticleCategories.map(async item => {
            if(item.seo_url == null || item.seo_url == 'undefined'){
                sitemap.write({ url: 'articles/'+item.id, changefreq: 'weekly', priority: 0.8 })
            }else{
                sitemap.write({ url: 'article/'+item.seo_url, changefreq: 'weekly', priority: 0.8 })
            }
        }));

        const expertises = await Expertise.query().orderBy('id', 'desc').fetch();
        const finalExpertises = expertises.toJSON();
        await  Promise.all(finalExpertises.map(async item => {
            sitemap.write({ url: 'advisers/'+item.id, changefreq: 'weekly', priority: 0.8 })
        }));

        sitemap.write({ url: '/', changefreq: 'weekly', priority: 0.8 })
        sitemap.write({ url: '/rules', changefreq: 'weekly', priority: 0.8 })
        sitemap.write({ url: '/news', changefreq: 'weekly', priority: 0.8 })
        sitemap.write({ url: '/about-us', changefreq: 'weekly', priority: 0.8 })
        sitemap.write({ url: '/contact-us', changefreq: 'weekly', priority: 0.8 })
        sitemap.write({ url: '/media', changefreq: 'weekly', priority: 0.8 })
        sitemap.write({ url: '/article-category', changefreq: 'weekly', priority: 0.8 })
        sitemap.write({ url: '/question', changefreq: 'weekly', priority: 0.8 })
        sitemap.write({ url: '/accept-lawyer', changefreq: 'weekly', priority: 0.8 })
        sitemap.write({ url: '/accept-judgment', changefreq: 'weekly', priority: 0.8 })
        sitemap.write({ url: '/legal-management', changefreq: 'weekly', priority: 0.8 })

        sitemap.end()

        return streamToPromise(sitemap)
            .then(sm => {
                console.log(sm.toString())

                fs.writeFile('./public/sitemap.xml', sm.toString(), (err) => {
                    // throws an error, you could also catch it here
                    if (err) throw err;
                
                    // success case, the file was saved
                    console.log('Lyric saved!');
                });
            })
            .catch(console.error);
    }
	async ios({ request, response }){
		let ip =  request.headers()
        const download = new ApplicationDownloads()
        download.ip = ip['x-forwarded-for']
        download.type = 5
        download.save()
		return response.redirect('https://sibapp.com/applications/%D8%A2%D9%86%DB%8C-%D9%85%D8%B4%D8%A7%D9%88%D8%B1');
	}
	async android({request, response}){
		let ip =  request.headers()
        const download = new ApplicationDownloads()
        download.ip = ip['x-forwarded-for']
        download.type = 6
        download.save()
		
		return response.redirect('https://play.google.com/store/apps/details?id=com.wemoshaver');

	}
    async redirect({ response , request }){
        const redirect = await Reidrect.query().where('from_url', request.url()).first();
        return response.redirect(redirect.to_url);
    }

    async getIndex({ view }) {
        const expertiseFirst = await Expertise.query().whereNull('parent_id').where('show_first', 1).where('status', 1).limit(6).fetch()
        
        return view.render('site.index', {
            expertiseFirst: expertiseFirst.toJSON()
        });
    }
    async question({ view, request }) {
        const questionCategory = await QuestionCategory.query().where('status', 1).orderBy('listorder', 'desc').fetch()
        const questions = await Question.query().where(function () {
            if (request.all()) {
                if (request.all().category_id) {
                    this.where('category_id', request.all().category_id)
                }
                if (request.all().question) {
                    this.where('question', 'LIKE', '%' + request.all().question + '%')
                }
            }
        }).orderBy('listorder', 'desc').fetch()
        if (request.all().category_id) {
            const category = await QuestionCategory.find(request.all().category_id)
            return view.render('site.question', {
                questionCategory: questionCategory.toJSON(),
                questions: questions.toJSON(),
                category: category
            });
        } else {
            return view.render('site.question', {
                questionCategory: questionCategory.toJSON(),
                questions: questions.toJSON()
            });
        }
    }
    async saveContactUs({ request, response, session }) {
        const contact = await ContactUs.create(request.only([
            'title',
            'name',
            'email',
            'content'
        ]));
        session.flash({ successContact: 'پیام شما با موفقیت ارسال شد' })
        return response.redirect('/contact-us');
    }
    async downloadApp({ request, response }) {
        let ip =  request.headers()
        const download = new ApplicationDownloads()
        download.ip = ip['x-forwarded-for']
        download.save()
        const setting = await Setting.first();
		return response.redirect('https://play.google.com/store/apps/details?id=com.wemoshaver')
    }
    async application({ request, response }) {
        let ip =  request.headers()
        const download = new ApplicationDownloads()
        download.ip = ip['x-forwarded-for']
        download.save()
        const setting = await Setting.first();
        if (setting) {
            if (setting.color2 != null) {
				return response.redirect('asset/admin/uploads/setting/main/' + setting.color2)

            } else {
                
                return response.redirect(setting.store_link)
            }
        } else {
            return 'not found'
        }
    }

    //Article & Article Category
    async articleCategory({ view }) {
        const articleCategories = await ArticleCategory.query().orderBy('id', 'desc').fetch()
        return view.render('site.article.category-list', {
            articleCategories: articleCategories.toJSON()
        });
    }

	async articles({ view, params,response }) {

		const category = await ArticleCategory.find(params.id)
        if(category.seo_url){
            return response.route('site.articles.detail',{'title':category.seo_url});
        }
        const articles = await Article.query().where('category_id', params.id).orderBy('id', 'desc').fetch()
        return view.render('site.article.list', {
            articles: articles.toJSON(),
            category : category
        });
    }
    async articleDetail({ view, params,response }) {
        const article = await Article.find(params.id)
        if(article.seo_url){
            return response.route('site.articles.detail',{'title':article.seo_url});
        }
        article.visit = article.visit + 1
        await article.save()
        const likes = await ArticleLike.query().where('article_id', article.id).count()
        const sameArticles = await Article.query().where('category_id', article.category_id).orderBy('id', 'desc').fetch()
        return view.render('site.article.detail', {
            article: article,
            sameArticles: sameArticles.toJSON(),
            likes: likes[0]['count(*)']
        });
    }

    async articleLike({ response, params }) {
        const article = await Article.find(params.id)
        await ArticleLike.create({
            ip: null,
            article_id: article.id
        })
        return response.redirect('/article-detail/' + article.id);
    }

    //News 
    async news({ view }) {
        const news = await Content.query().news().orderBy('id', 'desc').fetch()
        return view.render('site.news.list', {
            news: news.toJSON()
        });
    }
    async newsDetail({ view, params }) {
        const news = await Content.find(params.id)
        return view.render('site.news.detail', {
            news: news
        });
    }

    //Accepts 
    async acceptLawyer({ view }) {
        const states = await State.all()
        return view.render('site.accept.lawyer', {
            states: states.toJSON()
        });
    }
    async acceptJudgment({ view }) {
        const states = await State.all()
        return view.render('site.accept.judgment', {
            states: states.toJSON()
        });
    }
    async legalManagement({ view }) {
        const states = await State.all()
        return view.render('site.accept.management', {
            states: states.toJSON()
        });
    }
    async postAccept({ response, request, session }) {
        const accept = await Accept.create(request.only([
            'name',
            'mobile',
            'email',
            'phone',
            'title',
            'value',
            'state_id',
            'city_id',
            'description',
            'accept_type_id'
        ]));
        session.flash({ successAccept: 'تقاضای شما با موفقیت ارسال شد' })
        return response.redirect('/' + request.all().redirect_url + '/');
    }
    async cityAccept({ request }) {
        const cities = City.query().where('state_code', request.all().state_id).orderBy('id', 'desc').fetch()
        return cities;
    }
    //Advisers
    async advisers({ params, view }) {
        const expertises = await Expertise.query().where('id', params.id).with('users', (builder) => {
        builder.orderBy('rate', 'DESC')
        }).fetch();
        return view.render('site.close-advisers', {
            expertises: expertises.toJSON()
        });
    }

    makeText(length) {
        var result = '';
        var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    makeCode(length){
        var result = '';
        var characters = '0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    async forgetPassword({ request, response }) {
        const mobile = request.all().mobile;
        const user = await User.findBy('mobile', mobile);
        let result = 'شماره موبایل شما در سامانه پیدا نشد';
        let success = false;


		const api = Kavenegar.KavenegarApi({
		  apikey: '5851696C716C452B7943595A45765152557476416B36797458426D534244447462636D557847683875664D3D'
		});

		
		
        if (user !== null) {
            let password = Math.floor(Math.random() * 10000000);
            user.password = password.toString()
            await user.save();

            let message = 'رمز ورود شما : ' + password + '  با تشکر آنی مشاور '

			api.VerifyLookup({
				receptor:user.mobile,
				token: password.toString(),
				template: "forgetpassword"
			}, function(response, status) {
				console.log(response);
				console.log(status);
			});
			
            success = true;
            result = 'رمز شما برایتان پیامک شد';
        }

        const finalResult = { message: result, success: success }
        response.send(finalResult);
    }

    async checkCredit({request,response}){
        const input = request.all();
        const userId = input.userId;
        const personId = input.personId;
        const neededTime = input.neededTime;
        const neededType = input.neededType;
        const user = await User.find(userId);
        const person = await User.find(personId);

        let success = false;
        let message = '';

        const finalResult = { message: message, success: success }
        response.send(finalResult);
    }
  async sendConfirmCodehamide({request,response}){
        const input = request.all();
        let success = false;
        let code = this.makeCode(6);
        let message = 'کد فعال سازی شما : ' + code + '  با تشکر آنی مشاور '
        const sendResult = await axios.post('https://rest.payamak-panel.com/api/SendSMS/SendSMS', {
            username: 'law8516',
            password: '8516',
            to: '09125948691',
            from: '2188321088',
            text: 'پیام تست',
        });

        success = true;
        message = 'کد فعال سازی شما برایتان پیامک شد';
		
        return 'done';
    }
    async sendConfirmCode({request,response}){
        const input = request.all();
        const userId = input.userId;
        const user = await User.find(userId);
        let success = false;
        let code = this.makeCode(6);
        let message = 'کد فعال سازی شما : ' + code + '  با تشکر آنی مشاور '
        const sendResult = await axios.post('https://rest.payamak-panel.com/api/SendSMS/SendSMS', {
            username: 'law8516',
            password: '8516',
            to: user.mobile,
            from: '2188321088',
            text: message,
        });

        user.confirm_code = code;
        await user.save();
        success = true;
        message = 'کد فعال سازی شما برایتان پیامک شد';

        const finalResult = { message: code, success: success }
        response.send(finalResult);
    }
	  async media({ view }) {
        const repor = await Content.query().multiMedia().where('type',1).orderBy('id', 'desc').fetch()
        const film = await Content.query().multiMedia().where('type',2).orderBy('id', 'desc').fetch()
        const image = await Content.query().multiMedia().where('type',3).orderBy('id', 'desc').fetch()
        return view.render('site.media.list', {
            repor: repor.toJSON(),
            film: film.toJSON(),
            image: image.toJSON()
        });
    }

    async getSettings({ request , response}){
        const setting = await Setting.query().select('faq_button_caption').first();
        response.json(setting);
	}


    async mediaDetails({ view , params }){
        const media = await Content.find(params.id)
        return view.render('site.media.detail', {
            media: media
        });
    }
	async downloadPage({ request , view}){
		let ip =  request.headers()
        const download = new ApplicationDownloads()
        download.ip = ip['x-forwarded-for']
        download.type = 4
        download.save()
		return view.render('site.download-page');
	}
	async downloadApplication({ request , response }) {
        let ip =  request.headers()
        const download = new ApplicationDownloads()
        download.ip = ip['x-forwarded-for']
        download.type = 2
        download.save()
        const setting = await Setting.first();
        if (setting) {
            return response.redirect(setting.store_link)
        } else {
            return 'not found'
        }
    }
	
	    async downloadAnimoshaver({ request, response }) {
        let ip =  request.headers()
        const download = await new ApplicationDownloads()
        download.ip = ip['x-forwarded-for']
        download.type = 3
        download.save()
        const setting = await Setting.first();
        if (setting) {
            return response.redirect('https://animoshaver.ir/app-universal-release.apk')
        } else {
            return 'not found'
        }
    }
	
    async articleDetailKinds({view,params,request}){ 
        var title = decodeURIComponent(params.title);
        const articleCategory = await ArticleCategory.query().where('seo_url', title).first()
        const article = await Article.query().where('seo_url', title).first()
        if(articleCategory != null){
            const articles = await Article.query().where('category_id', articleCategory.id).with('category').orderBy('id', 'desc').fetch()
            return view.render('site.article.list', {
                articles: articles.toJSON(),
                category:articleCategory
            });
        }
        if(article != null){
            article.visit = article.visit + 1
            await article.save()
            const likes = await ArticleLike.query().where('article_id', article.id).count()
            const sameArticles = await Article.query().where('category_id', article.category_id).with('category').orderBy('id', 'desc').fetch()
            return view.render('site.article.detail', {
                article: article,
                sameArticles: sameArticles.toJSON(),
                likes: likes[0]['count(*)']
            });
        }
    }

}

module.exports = HomeController
