import cron from 'node-cron';
import OfferModel from '../businessDashboard/offers/offers.model';
import MealModel from '../businessDashboard/meal/meal.model';

const checkExpiredOffers = async () => {
  try {
    const currentDate = new Date();
    console.log(currentDate.toISOString().split('T')[0]);
    const expiredOffers = await OfferModel.find({
      endDate: { $lt: currentDate.toISOString().split('T')[0] },
      status: { $ne: 'completed' },
    });

    if (expiredOffers.length === 0) {
      console.log('No expired offers found.');
      return;
    }

    // Fix: Use `map()` to collect item IDs first
    const mealIds = expiredOffers.map(offer => offer.itemId);

    // Fix: Use `Promise.all` for meal updates with `findById` check
    const mealUpdates = await Promise.all(
      mealIds.map(async itemId => {
        const mealExists = await MealModel.findById(itemId);
        if (mealExists) {
          return MealModel.updateOne(
            { _id: itemId },
            { $set: { offerPrice: mealExists.price, offerStatus: false } }
          );
        }
      })
    );

    // Fix: Use `Promise.all` for offer updates
    const offerUpdates = await Promise.all(
      expiredOffers.map(offer =>
        OfferModel.updateOne(
          { _id: offer._id },
          { $set: { status: 'completed' } }
        )
      )
    );

    console.log(
      `Updated ${mealUpdates.length} meals and ${offerUpdates.length} offers.`
    );
  } catch (error) {
    console.error('Error updating expired offers:', error);
  }
};

// Schedule job to run every day at 00:00 (midnight)
export const startCheckOfferJob = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('Running scheduled job: Checking expired offers...');
    await checkExpiredOffers();
  });
};
