import {
  deletePhotoData,
  savePhotoCallBackData,
} from "#root/bot/callback-data/index.js";
import { UserText } from "#root/bot/const/index.js";
import { Context } from "#root/bot/context.js";
import { Conversation } from "@grammyjs/conversations";
import { CallbackQueryContext, InlineKeyboard } from "grammy";

type Properties = {
  ctx: Context;
  conversation: Conversation<Context>;
};

export type PhotoType = {
  id: string;
  fileId: string;
  fileUrl: string;
};

const sendPhotos = async (ctx: Context, values: PhotoType[]) => {
  const promises: Promise<unknown>[] = [];

  values.map(async ({ id, fileId }) => {
    const promise = ctx.replyWithPhoto(fileId, {
      caption: UserText.GetPhotos.PHOTO_CAPTION,
      reply_markup: InlineKeyboard.from([
        [
          {
            text: UserText.GetPhotos.DELETE_PHOTO_BUTTON,
            callback_data: deletePhotoData.pack({ id }),
          },
        ],
      ]),
    });

    promises.push(promise);
  });

  await Promise.all(promises);
};

const handlePhotoCallback = async (
  answerCtx: Context,
  conversation: Conversation<Context>,
) => {
  const { customData } = conversation.session;
  const file = await answerCtx.getFile();

  customData[file.file_unique_id] = {
    id: file.file_unique_id,
    fileId: file.file_id,
    fileUrl: file.getUrl(),
  };

  const photos = Object.values(customData);

  await sendPhotos(answerCtx, photos);

  await answerCtx.reply(UserText.GetPhotos.MSG_TEXT, {
    reply_markup: InlineKeyboard.from([
      [
        {
          text: UserText.GetPhotos.SAVE,
          callback_data: savePhotoCallBackData,
        },
      ],
    ]),
  });
};

const handleDeletePhotoCallback = async (
  answerCtx: CallbackQueryContext<Context>,
  conversation: Conversation<Context>,
) => {
  const { id } = deletePhotoData.unpack(answerCtx.callbackQuery!.data!);
  const { customData } = conversation.session;

  delete customData[id];
  await answerCtx.deleteMessage();
};

const waitForPhotoCallback = async (
  conversation: Conversation<Context>,
  ctx: Context,
) => {
  return conversation.waitForCallbackQuery(savePhotoCallBackData, {
    otherwise: async (answerCtx: CallbackQueryContext<Context> | Context) => {
      if (answerCtx.has("msg:photo")) {
        await handlePhotoCallback(answerCtx, conversation);
      } else if (
        answerCtx.hasCallbackQuery(deletePhotoData.filter()) &&
        answerCtx.callbackQuery?.data
      ) {
        await handleDeletePhotoCallback(answerCtx, conversation);
      } else {
        await ctx.reply(UserText.GetPhotos.UNHANDLED_TEXT);
      }
    },
    drop: true,
  });
};

export const getPhotos = async ({
  ctx,
  conversation,
}: Properties): Promise<[string[], Context]> => {
  const { customData } = conversation.session;
  const keyboard = InlineKeyboard.from([
    [
      {
        text: UserText.GetPhotos.NEXT,
        callback_data: savePhotoCallBackData,
      },
    ],
  ]);

  await ctx.reply(UserText.GetPhotos.MSG_TEXT, {
    reply_markup: keyboard,
  });

  const photosCtx = await waitForPhotoCallback(conversation, ctx);

  const photos = Object.values(customData).filter(Boolean) as PhotoType[];

  photosCtx.session.customData = {};
  const photoUrs = photos.map((photo) => photo.fileUrl);

  photosCtx.services = ctx.services;
  return [photoUrs, photosCtx];
};
