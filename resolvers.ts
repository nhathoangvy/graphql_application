/// <reference path='./models.d.ts' />

import { genId } from "./utils.ts"
import { archive, column, card  } from "./repositories.ts"
import { message } from "./responses.ts"

export const resolvers = {
    ColumnResult: {
      __resolveType(root:any) { 
        return root.id? "Column": "MessageOptions"
      }
    },
    CardResult: {
      __resolveType(root:any) { 
        return root.id? "Card": "MessageOptions"
      }
    },
    Query: {
      /* --> Column API */
      findColumnId: async (_: any, { id }: any):Promise<Column | any> => {
        const col: Column = await column.get({id});
        return col.id ? await (async () => {
          col.cards = await card.lists(col.id);
          return col;
        })() : null
      },
      columns: async ():Promise<Column[]> => { 
        return await column.lists()
      },
      
      /********************************************************************/

      /* --> Column API */
      findCardId: async (_: any, { id }: any):Promise<Card | any> => {
        const ca: Card = await card.get({id});
        return ca.id ? ca : null
      },
      cards: async ():Promise<Card[]> => await card.lists()
    },
    Mutation: {

      /* 

        ==> GraphQL routing has already been validation.

        ==> This is a validate function but just backup if we use Restful API, MVC...etc...

        import { Validator } from "./validator.ts"

        const required:ValidType = 
        {
          "model": <ValidCondition>
          {
            "action": <Array<string>> 
            [
              "name", 
              "order"
            ]
          }
        }

        Validator.Validation<Type>(Type, "model", "action")

      */

      /* --> Column API */
      createColumn: async (_: any, args: any):Promise<Column|MessageOptions> => {
        const existed = await column.existed(args);
        if (existed) return message.StatusBadRequest()

        const id = genId();
        await column.set(
          Object.assign(
            <Column>{
              id: id,
            }, args
          )
        );
        return await column.get({id});
      },
      updateColumn: async (_: any, args: any):Promise<MessageOptions> => {
        const updated = await column.update(args);
        if (!updated) return message.StatusBadRequest()

        return message.OK()
      },
      removeColumn: async (_:any, args: any):Promise<MessageOptions> => {
        const removed = await column.remove(args);
        if (!removed) return message.StatusBadRequest()

        return message.OK()
      },

      /********************************************************************/

      /* --> Card API */
      createCard: async (_: any, args: any):Promise<Card|MessageOptions> => {
        const existed = await card.existed(args);
        if (existed) return message.StatusBadRequest();

        const col = await column.get({name: args.columnName});
        if (!col.id) return message.StatusBadRequest();

        const id = genId();
        await card.set(
          Object.assign(
            <Card>
            {
              id: id,
              columnId: col.id
            }, args
          )
        );

        return await card.get({id});
      },
      updateCard: async (_: any, args: any):Promise<MessageOptions> => {
        const updated = await card.update(args);
        if (!updated) return message.StatusBadRequest()

        return message.OK()
      },
      archiveCard: async (_:any, args: any):Promise<MessageOptions> => {
        const current = await card.get(args);
        if (!current.id) return message.StatusBadRequest();
        current.status = args.status;

        const removed = await card.remove(args);
        if (!removed) return message.StatusBadRequest()
        await archive.push("card", current);
        return message.OK();
      }
    }
  };