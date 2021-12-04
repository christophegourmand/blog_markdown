const mongoose = require('mongoose');
const marked = require('marked');
const slugify = require('slugify');

const articleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        markdown: {
            type: String,
            required: true
        },
        createdAt:{
            type: Date,
            default: Date.now /* UPDATE 24nov2021 : replace `Date.now` with `Date`  */
            /* 
            info1:
                as our form doesn't post a field called 'createdAt' , so the function under key 'default' will be used.
            info2:
                `Date.now` is used without `()` so the function isn't called now, 
                but will be called every time we create an article.
            */
        },
        slug: {
            type: String,
            required: true,
            unique: true  // to avoid 2 articles to have the same slug.
        }
    }
);

/* we want to store the slug uri for each article in database. So we need to calculate the 'slug' once before it it stored */
articleSchema.pre(
    'validate', 
    function(next) {
        if (this.title) {
            this.slug = slugify( this.title , {lower: true , strict: true} );
        }

        next();
    }
);


/* `moogoose.model()` compile a model by making a copy of a 'schema' 
- (Think of that: for example, a schema containing properties 'name:string' and 'id:int" could be used to compile models of many different things!).
- In other words, a schema describe <what properties> and with <which type> , but it doesn't explain what we describe.. (a user, an article, a product, a coffee maker) ..the only to explain that is the method `mongoose.model(<what is it> , <what schema to describe its properties>)` !
*/
module.exports = mongoose.model('Article', articleSchema);