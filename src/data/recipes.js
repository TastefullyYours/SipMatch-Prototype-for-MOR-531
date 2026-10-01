// "How to make it" recipes, keyed by drink id (drinks.json). Classic, widely published specs.
// 1 oz ≈ 30 ml (about 2 tablespoons). Simple syrup = equal parts sugar and hot water, stirred and cooled.

export const RECIPES = {
  margarita: {
    glass: 'Rocks glass, salted rim',
    ingredients: ['2 oz tequila blanco', '1 oz fresh lime juice', '1 oz triple sec (or orange liqueur)', 'Salt and a lime wedge for the rim'],
    steps: ['Run a lime wedge around the rim and dip it in salt.', 'Shake the tequila, lime and triple sec with ice for about 15 seconds.', 'Strain over fresh ice. Garnish with a lime wheel.'],
  },
  mojito: {
    glass: 'Tall glass',
    ingredients: ['2 oz white rum', '¾ oz fresh lime juice', '¾ oz simple syrup', '6–8 mint leaves', 'Club soda to top'],
    steps: ['Gently press the mint with the syrup and lime in the glass (don’t shred it).', 'Add rum and fill with crushed or cubed ice.', 'Top with club soda, stir once, and garnish with a mint sprig.'],
  },
  martini: {
    glass: 'Chilled martini glass',
    ingredients: ['2½ oz vodka', '½ oz dry vermouth', 'Green olives'],
    steps: ['Stir vodka and vermouth with lots of ice for 20–30 seconds (or shake, Bond-style).', 'Strain into a chilled glass.', 'Garnish with olives on a pick.'],
  },
  'aperol-spritz': {
    glass: 'Large wine glass',
    ingredients: ['3 oz Prosecco', '2 oz Aperol', '1 oz club soda', 'Orange slice'],
    steps: ['Fill the glass with ice.', 'Pour in Prosecco, then Aperol, then a splash of soda.', 'Give it one gentle stir and add the orange slice.'],
  },
  paloma: {
    glass: 'Tall glass, optional salted rim',
    ingredients: ['2 oz tequila blanco', '½ oz fresh lime juice', '4 oz grapefruit soda', 'Pinch of salt'],
    steps: ['Fill the glass with ice and add tequila, lime and a pinch of salt.', 'Top with grapefruit soda.', 'Stir gently and garnish with a lime or grapefruit wedge.'],
  },
  'old-fashioned': {
    glass: 'Rocks glass with one big ice cube',
    ingredients: ['2 oz bourbon or rye', '¼ oz simple syrup (or 1 sugar cube)', '2 dashes Angostura bitters', 'Orange peel'],
    steps: ['Stir whiskey, syrup and bitters with ice for about 20 seconds.', 'Strain over one large ice cube.', 'Squeeze the orange peel over the drink and drop it in.'],
  },
  'hot-toddy': {
    glass: 'Mug',
    ingredients: ['1½ oz whiskey', '½ oz honey', '½ oz fresh lemon juice', '4 oz hot water', 'Cinnamon stick (optional)'],
    steps: ['Warm the mug with hot water, then pour it out.', 'Add honey and a splash of hot water and stir to dissolve.', 'Add whiskey, lemon and the rest of the hot water. Garnish with a lemon wheel or cinnamon stick.'],
  },
  'espresso-martini': {
    glass: 'Chilled coupe or martini glass',
    ingredients: ['2 oz vodka', '1 oz fresh espresso (cooled) or cold brew concentrate', '½ oz coffee liqueur', '¼ oz simple syrup (optional)'],
    steps: ['Add everything to a shaker with plenty of ice.', 'Shake hard for 15–20 seconds to build the foam.', 'Strain into a chilled glass and top with 3 coffee beans.'],
  },
  highball: {
    glass: 'Tall glass packed with ice',
    ingredients: ['1½–2 oz whisky', '4–5 oz very cold club soda', 'Lemon twist (optional)'],
    steps: ['Fill a tall glass to the top with ice and add the whisky.', 'Pour the soda slowly down the side of the glass.', 'Stir once, gently, to keep the bubbles.'],
  },
  mimosa: {
    glass: 'Champagne flute',
    ingredients: ['3 oz chilled sparkling wine', '3 oz chilled orange juice'],
    steps: ['Pour the sparkling wine into the flute first.', 'Top slowly with orange juice.', 'No need to stir.'],
  },
  'french-75': {
    glass: 'Champagne flute',
    ingredients: ['1 oz gin', '½ oz fresh lemon juice', '½ oz simple syrup', '2–3 oz Champagne or dry sparkling wine'],
    steps: ['Shake gin, lemon and syrup with ice.', 'Strain into a flute.', 'Top with sparkling wine and garnish with a lemon twist.'],
  },
  'bloody-mary': {
    glass: 'Tall glass',
    ingredients: ['1½ oz vodka', '4 oz tomato juice (or Bloody Mary mix)', '½ oz fresh lemon juice', '2 dashes Worcestershire sauce', '2 dashes hot sauce', 'Pinch of salt and pepper', 'Celery stalk'],
    steps: ['Add everything to a glass of ice (skip extra seasoning if using a mix).', 'Pour back and forth between two glasses, or stir well, to mix without frothing.', 'Garnish with celery, plus olives or pickles if you like.'],
  },
  'gin-martini': {
    glass: 'Chilled martini glass',
    ingredients: ['2½ oz London Dry gin', '½ oz dry vermouth', 'Lemon twist or olive'],
    steps: ['Stir gin and vermouth with lots of ice for 20–30 seconds.', 'Strain into a chilled glass.', 'Garnish with a lemon twist or an olive.'],
  },
  'whiskey-sour': {
    glass: 'Rocks glass',
    ingredients: ['2 oz bourbon', '¾ oz fresh lemon juice', '¾ oz simple syrup', '1 egg white (optional, for foam)'],
    steps: ['If using egg white, shake everything without ice first for 10 seconds.', 'Add ice and shake again until very cold.', 'Strain over fresh ice. Garnish with a cherry or lemon.'],
  },
  manhattan: {
    glass: 'Chilled coupe',
    ingredients: ['2 oz rye or bourbon', '1 oz sweet vermouth', '2 dashes Angostura bitters', 'Cocktail cherry'],
    steps: ['Stir everything with ice for about 30 seconds.', 'Strain into a chilled coupe.', 'Garnish with a cherry.'],
  },
  negroni: {
    glass: 'Rocks glass',
    ingredients: ['1 oz gin', '1 oz Campari', '1 oz sweet vermouth', 'Orange peel'],
    steps: ['Stir all three with ice for about 20 seconds.', 'Strain over fresh ice (a big cube is ideal).', 'Garnish with an orange peel.'],
  },
  'pina-colada': {
    glass: 'Hurricane or tall glass',
    ingredients: ['2 oz white rum', '1½ oz cream of coconut', '3 oz pineapple juice', '½ oz fresh lime juice (optional)', '1 cup ice'],
    steps: ['Add everything to a blender.', 'Blend until smooth.', 'Pour and garnish with a pineapple wedge.'],
  },
  cosmopolitan: {
    glass: 'Chilled martini glass',
    ingredients: ['1½ oz citrus vodka', '½ oz triple sec', '½ oz fresh lime juice', '1 oz cranberry juice'],
    steps: ['Shake everything with ice.', 'Strain into a chilled glass.', 'Garnish with a lime wheel or orange twist.'],
  },
  'moscow-mule': {
    glass: 'Copper mug or rocks glass',
    ingredients: ['2 oz vodka', '½ oz fresh lime juice', '4 oz ginger beer'],
    steps: ['Fill the mug with ice.', 'Add vodka and lime, then top with ginger beer.', 'Stir gently and garnish with a lime wedge.'],
  },
  daiquiri: {
    glass: 'Chilled coupe',
    ingredients: ['2 oz white rum', '1 oz fresh lime juice', '¾ oz simple syrup'],
    steps: ['Shake everything hard with ice.', 'Strain into a chilled coupe.', 'Garnish with a lime wheel.'],
  },
  'mai-tai': {
    glass: 'Rocks glass with crushed ice',
    ingredients: ['2 oz aged rum', '¾ oz fresh lime juice', '½ oz orange curaçao', '½ oz orgeat (almond syrup)', '¼ oz simple syrup'],
    steps: ['Shake everything with ice.', 'Pour into a glass filled with crushed ice.', 'Garnish with a mint sprig and the spent lime half.'],
  },
  'white-russian': {
    glass: 'Rocks glass',
    ingredients: ['2 oz vodka', '1 oz coffee liqueur', '1 oz heavy cream (or whole milk)'],
    steps: ['Fill the glass with ice and add vodka and coffee liqueur.', 'Slowly pour the cream on top.', 'Stir before sipping, or leave it layered.'],
  },
  'lemon-drop': {
    glass: 'Martini glass, sugared rim',
    ingredients: ['2 oz citrus vodka', '½ oz triple sec', '1 oz fresh lemon juice', '½ oz simple syrup', 'Sugar for the rim'],
    steps: ['Wet the rim with lemon and dip it in sugar.', 'Shake everything else with ice.', 'Strain into the glass and garnish with a lemon twist.'],
  },
  'dirty-martini': {
    glass: 'Chilled martini glass',
    ingredients: ['2½ oz vodka or gin', '½ oz dry vermouth', '½ oz olive brine', '2–3 olives'],
    steps: ['Stir (or shake) everything with ice until very cold.', 'Strain into a chilled glass.', 'Garnish with olives.'],
  },
  'mint-julep': {
    glass: 'Julep cup or rocks glass',
    ingredients: ['2½ oz bourbon', '½ oz simple syrup', '8 mint leaves', 'Crushed ice'],
    steps: ['Gently press the mint with the syrup in the glass.', 'Add bourbon and pack the glass with crushed ice.', 'Stir until frosty, top with more ice and a big mint sprig.'],
  },
  'red-sangria': {
    glass: 'Pitcher · serves about 6',
    ingredients: ['1 bottle (750 ml) Spanish red wine', '¼ cup brandy', '½ cup orange juice', '2–3 tbsp sugar', '1 orange, 1 apple, a handful of berries, chopped', 'Club soda to top (optional)'],
    steps: ['Stir wine, brandy, juice and sugar in a pitcher until the sugar dissolves.', 'Add the fruit and chill for at least 2 hours.', 'Serve over ice, topped with a splash of soda.'],
  },
  'white-sangria': {
    glass: 'Pitcher · serves about 6',
    ingredients: ['1 bottle (750 ml) dry white wine', '¼ cup brandy or peach schnapps', '2 tbsp honey or sugar', '2 peaches, 1 orange, 1 lemon, sliced', 'Club soda to top'],
    steps: ['Stir wine, brandy and honey in a pitcher until dissolved.', 'Add the fruit and chill for at least 2 hours.', 'Serve over ice, topped with soda.'],
  },
  gin: {
    glass: 'Tall glass · gin & tonic',
    ingredients: ['2 oz gin', '4 oz tonic water', 'Lime wedge or cucumber slice'],
    steps: ['Fill a tall glass with ice and add gin.', 'Top with tonic.', 'Stir gently and garnish.'],
  },
  'spiced-rum': {
    glass: 'Tall glass',
    ingredients: ['2 oz spiced rum', '4 oz cola or ginger beer', 'Lime wedge'],
    steps: ['Fill a tall glass with ice and add rum.', 'Top with cola or ginger beer.', 'Squeeze in the lime and stir.'],
  },
  shandy: {
    glass: 'Pint glass',
    ingredients: ['6 oz cold light lager', '6 oz cold lemonade (or lemon soda)'],
    steps: ['Pour the beer into a tilted glass.', 'Top with lemonade.', 'Garnish with a lemon wheel.'],
  },
  'virgin-mojito': {
    glass: 'Tall glass',
    ingredients: ['¾ oz fresh lime juice', '¾ oz simple syrup', '8 mint leaves', 'Club soda to top'],
    steps: ['Gently press the mint with syrup and lime.', 'Fill with ice and top with soda.', 'Stir and garnish with mint.'],
  },
  'zero-spritz': {
    glass: 'Large wine glass',
    ingredients: ['3 oz non-alcoholic bitter aperitif', '3 oz club soda or alcohol-free sparkling wine', 'Orange slice'],
    steps: ['Fill the glass with ice.', 'Add the aperitif, then top with soda.', 'Stir once and add the orange slice.'],
  },
  'espresso-tonic': {
    glass: 'Tall glass',
    ingredients: ['4 oz tonic water', '1–2 oz fresh espresso or cold brew concentrate'],
    steps: ['Fill a glass with ice and add tonic.', 'Pour the espresso slowly over the back of a spoon so it floats.', 'Stir before drinking if you like it mixed.'],
  },
}
