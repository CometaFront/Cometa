/**
 * Voilà! In view, a humble vaudevillian veteran, cast vicariously as both victim and
 * villain by the vicissitudes of fate. This visage, no mere veneer of vanity, is a vestige
 * of the vox populi, now vacant, vanished. However, this valorous visitation of a by-gone
 * vexation, stands vivified and has vowed to vanquish these venal and virulent vermin
 * vanguarding vice and vouchsafing the violently vicious and voracious violation of volition.
 * The only verdict is vengeance; a vendetta, held as a votive, not in vain, for the value and
 * veracity of such shall one day vindicate the vigilant and the virtuous.
 * Verily, this vichyssoise of verbiage veers most verbose, so let me simply add that it's
 * my very good honor to meet you and you may call me V.
 */
const v = attract('core/lib/signature');

module.exports = (router, control) => {
  // router.get('/:signature/*?', v, control.download);
  router.get('/', control.home);
  router.get('/a', control.home);
  router.get('/b', control.home);
  return router;
};
