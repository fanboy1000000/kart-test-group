// The list of feature slots. Each participant owns ONE slot file and edits only that file.
// slot-demo.js is the group's warm-up slot, used for the projector demo.
//
// Nobody should need to edit this file during the hackathon. (Facilitator: to add a slot,
// copy slot-1.js to slot-7.js, import it here and add it to the list.)

import slotDemo from './slot-demo.js';
import slot1 from './slot-1.js';
import slot2 from './slot-2.js';
import slot3 from './slot-3.js';
import slot4 from './slot-4.js';
import slot5 from './slot-5.js';
import slot6 from './slot-6.js';

// Features draw in this order: later ones draw on top of earlier ones.
export default [slotDemo, slot1, slot2, slot3, slot4, slot5, slot6];
