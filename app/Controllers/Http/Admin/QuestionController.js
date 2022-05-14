'use strict'
const Question = use('App/Models/Question')
const QuestionCategory = use('App/Models/QuestionCategory')
const Tag = use('App/Models/Tag')

class QuestionController {
    async list({ request,view }){
        const page = request.get().page || 1;

        const questions = await Question.query().where(function () {
            if(request.all()){
                if(request.all().category_id){
                    this.where('category_id',request.all().category_id)
                }        
                if(request.all().question){
                    this.where('question', 'LIKE', '%'+request.all().question+'%')
                }
                if(request.all().answer){
                    this.where('answer', 'LIKE', '%'+request.all().answer+'%')
                }
            }
        }).with('category').orderBy('id', 'desc').paginate(page,10)
        const questionCategory = await QuestionCategory.query().orderBy('id', 'desc').fetch();
        return view.render('admin.question.list',{
            questions  : questions.toJSON(),
            questionCategory  : questionCategory.toJSON()
        });
    }
    async create({ view }){
        const tags = await Tag.all()
        const status = { '1' : 'فعال', '0': 'غیر فعال' };
        return view.render('admin.question.create',{
            tags  : tags.toJSON(),
            status : status
        })
    }
    async store({request, response}){
        
        if(request.all().show_first == 'on'){
            request.all().show_first = 1;
        }else{
            request.all().show_first = 0;
        }
        if(request.all().show_menu == 'on'){
            request.all().show_menu = 1;
        }else{
            request.all().show_menu = 0;
        }
        if(request.all().show_side == 'on'){
            request.all().show_side = 1;
        }else{
            request.all().show_side = 0;
        }
        const question = await Question.create(request.only([
            'question',
            'category_id',
            'status',
            'answer',
            'title_seo',
            'keyword',
            'show_first',
            'show_menu',
            'show_side',
            'description'
        ]));
        await question.tag().attach(request.all().tagIds)
        return response.redirect('/admin/question/list');
    }
    async update({ view , params}){
        const questionCategory = await QuestionCategory.query().with('parent').orderBy('id', 'desc').fetch();
        const question = await Question.find(params.id);
        const status = { '1' : 'فعال', '0': 'غیر فعال' };
        const tags = await Tag.all()

        return view.render('admin.question.update',{
            questionCategory  : questionCategory.toJSON(),
            question  : question,
            status : status,
            tags : tags.toJSON()
        });
    }
    async edit({ response , request , params }){
        const question = await Question.find(params.id);
        question.question = request.all().question;
        question.category_id = request.all().category_id;
        question.status = request.all().status;
        question.answer = request.all().answer;
        question.title_seo = request.all().title_seo;
        question.keyword = request.all().keyword;
        question.show_first = request.all().show_first;
        question.show_menu = request.all().show_menu;
        question.show_side = request.all().show_side;
        question.description = request.all().description;
        await question.save();
        await question.tag().detach()
        await question.tag().attach(request.all().tagIds)
        return response.redirect('/admin/question/list');
    }
    async destroy({request,response}){
        const question = await  Question.query().whereIn('id',request.all().deletedId).delete()
        return response.redirect('back');
    }
}

module.exports = QuestionController
