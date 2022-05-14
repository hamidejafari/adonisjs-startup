'use strict'
const QuestionCategory = use('App/Models/QuestionCategory')

class QuestionCategoryController {
    async list({ request,view }){
        const page = request.get().page || 1;
        const questionCategory = await QuestionCategory.query().where(function () {
            if(request.all()){
                if(request.all().title){
                    this.where('title', 'LIKE', '%'+request.all().title+'%')
                }
                if(request.all().parent_id && request.all().parent_id != 'all'){
                    this.where('parent_id', request.all().parent_id)
                }
            }
        }).with('parent').orderBy('id','desc').paginate(page,7)

        // const questionCategory = await QuestionCategory.query().with('parent').orderBy('id', 'desc').paginate(page,7);
        const categories = await QuestionCategory.query().where('parent_id',null).orderBy('id', 'desc').fetch();
        return view.render('admin.question-category.list',{
            questionCategory  : questionCategory.toJSON(),
            categories  : categories.toJSON()
        });
    }
    async store({response , request}){
        const questionCategory = await QuestionCategory.create(request.only([
            'title',
            'parent_id'
        ]));
        return response.redirect('back');
    }
    async edit({ response , request , params }){
        const questionCategory = await QuestionCategory.find(request.all().category_id);
        console.log(request.all())
        questionCategory.title = request.all().title;
        questionCategory.parent_id = request.all().parent_id;
        await questionCategory.save();
        return response.redirect('back');
    }
    async delete({params,response}){
        const questionCategory = await QuestionCategory.find(params.id);
        await questionCategory.delete();
        return response.redirect('back');
    }

}

module.exports = QuestionCategoryController
