module.exports = function(ctx, resolve) {
    return {
        createCharacter: function() {
            ctx.models.character.create(ctx.params.body)
                .then(character => resolve(character))
                .catch(err => resolve({error: err}, 400));
        },
        updateCharacter: async function() {
            let character = await ctx.models.character.findOne({where: {id: ctx.params.url.id}});

            if(!character) {
                return resolve(404);
            }

            character.name = ctx.params.body.name;

            return character.save()
                .then(updatedCharacter => resolve(updatedCharacter))
                .catch(err => resolve({error: err}, 400));
        }
    }
};
