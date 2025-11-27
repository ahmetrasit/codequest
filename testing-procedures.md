# FEATURE TESTING PROCEDURES
**CODE QUEST - Agent 2 Testing Guide**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## FEATURE 3: THIRD-PERSON CAMERA

### Code Review Checklist:
- [ ] Check Scene.jsx - OrbitControls should be removed
- [ ] New camera component created (ThirdPersonCamera.jsx or similar)
- [ ] Camera follows player position from gameStore
- [ ] Mouse movement updates camera rotation
- [ ] Smooth interpolation for camera movement (lerp/slerp)
- [ ] Camera distance is configurable
- [ ] No clipping through ground or player

### Files to Check:
```
/home/user/codequest/src/components/game/Scene.jsx
/home/user/codequest/src/components/game/ThirdPersonCamera.jsx (or similar)
/home/user/codequest/src/systems/InputSystem.js (for mouse input)
```

### Test Commands:
```bash
# Check Scene.jsx for OrbitControls removal
grep -n "OrbitControls" /home/user/codequest/src/components/game/Scene.jsx

# Find camera-related files
find /home/user/codequest/src -name "*Camera*" -type f | grep -v node_modules

# Check for mouse event handlers
grep -rn "mouse\|pointer" /home/user/codequest/src/components/game/ --include="*.jsx"
```

### Manual Testing:
1. Load game in browser (http://localhost:3000)
2. Move player with WASD - camera should follow
3. Move mouse left/right - camera should rotate around player
4. Move mouse up/down - camera pitch should change
5. Walk toward walls - camera should not clip through
6. Check camera distance feels right (5-8 units from player)
7. Verify smooth movement (no jarring jumps)

### Performance Tests:
- Check FPS while moving and rotating camera
- Verify no lag when changing directions quickly
- Test smooth interpolation (no stuttering)

### Pass Criteria:
- ✅ Camera follows player smoothly
- ✅ Mouse controls camera rotation
- ✅ No clipping issues
- ✅ 60 FPS maintained
- ✅ Camera distance appropriate
- ✅ OrbitControls removed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## FEATURE 4: PLAYER STATS

### Code Review Checklist:
- [ ] All stats in gameStore.js (health, stamina, mana, etc.)
- [ ] Initial values correct
- [ ] takeDamage() action exists and works
- [ ] heal() action exists and works
- [ ] useStamina() action exists and works
- [ ] useMana() action exists and works
- [ ] Stats can't go below 0
- [ ] Stats can't exceed max values
- [ ] Regeneration logic (if applicable)

### Files to Check:
```
/home/user/codequest/src/systems/gameStore.js
```

### Test Commands:
```bash
# Check gameStore for all stat actions
grep -A 10 "takeDamage\|heal\|useStamina\|useMana" /home/user/codequest/src/systems/gameStore.js

# Verify stat initialization
grep -A 30 "player:" /home/user/codequest/src/systems/gameStore.js
```

### Manual Testing:
1. Open browser console
2. Access gameStore: `window.__REDUX_DEVTOOLS_EXTENSION__`
3. Test takeDamage: Verify health decreases
4. Test heal: Verify health increases (capped at maxHealth)
5. Test useStamina: Verify stamina decreases
6. Test useMana: Verify mana decreases
7. Check bounds: Try negative health, over-max healing
8. Verify HUD updates reflect stat changes

### Pass Criteria:
- ✅ All required stats present
- ✅ Correct initial values
- ✅ All actions work correctly
- ✅ Bounds checking works (0 to max)
- ✅ Stats update in real-time
- ✅ No crashes or errors

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## FEATURE 5: DASH MECHANIC

### Code Review Checklist:
- [ ] Space key binding in InputSystem
- [ ] Dash state in gameStore (isDashing, dashCooldown)
- [ ] Dash duration: 0.3 seconds
- [ ] Dash speed: 2-3x normal speed
- [ ] Cooldown: 10 seconds
- [ ] Can't dash during cooldown
- [ ] Visual trail/effect exists
- [ ] Stamina cost (if applicable)

### Files to Check:
```
/home/user/codequest/src/systems/InputSystem.js
/home/user/codequest/src/systems/gameStore.js
/home/user/codequest/src/components/game/Player.jsx
/home/user/codequest/src/components/game/DashEffect.jsx (or similar)
```

### Test Commands:
```bash
# Check for space key handling
grep -n "space\|Space\| " /home/user/codequest/src/systems/InputSystem.js

# Check for dash state
grep -n "dash\|Dash" /home/user/codequest/src/systems/gameStore.js

# Find dash effect files
find /home/user/codequest/src -name "*Dash*" -type f | grep -v node_modules
```

### Manual Testing:
1. Press Space - dash should activate
2. Time the dash - should last ~0.3 seconds
3. Check speed - should be much faster than normal
4. Press Space again immediately - should not work (cooldown)
5. Wait 10 seconds - Space should work again
6. Verify visual trail appears during dash
7. Check stamina reduction (if applicable)
8. Test dash in all directions (W+Space, A+Space, etc.)

### Performance Tests:
- Check FPS during dash
- Verify smooth transition in/out of dash
- No lag or stuttering during dash

### Pass Criteria:
- ✅ Space triggers dash
- ✅ Dash lasts 0.3 seconds
- ✅ Fast movement (2-3x speed)
- ✅ 10 second cooldown works
- ✅ Can't dash during cooldown
- ✅ Visual feedback present
- ✅ 60 FPS maintained

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## FEATURE 6: BLOCK MECHANIC

### Code Review Checklist:
- [ ] Q key binding in InputSystem
- [ ] Block state in gameStore (isBlocking, blockCooldown)
- [ ] Parry window exists (brief perfect timing window)
- [ ] Cooldown: 10 seconds
- [ ] Shield visual appears
- [ ] Damage reduction logic
- [ ] Clear visual feedback

### Files to Check:
```
/home/user/codequest/src/systems/InputSystem.js
/home/user/codequest/src/systems/gameStore.js
/home/user/codequest/src/components/game/Player.jsx
/home/user/codequest/src/components/game/BlockShield.jsx (or similar)
```

### Test Commands:
```bash
# Check for Q key handling
grep -n "'q'\|\"q\"" /home/user/codequest/src/systems/InputSystem.js

# Check for block state
grep -n "block\|Block\|parry\|Parry" /home/user/codequest/src/systems/gameStore.js

# Find shield effect files
find /home/user/codequest/src -name "*Block*" -o -name "*Shield*" | grep -v node_modules
```

### Manual Testing:
1. Press Q - block should activate
2. Verify shield visual appears
3. Test parry window timing (if enemies exist)
4. Press Q again - should not work (cooldown)
5. Wait 10 seconds - Q should work again
6. Check visual feedback is clear
7. Verify damage reduction (if testable)

### Pass Criteria:
- ✅ Q triggers block
- ✅ Shield visual appears
- ✅ Parry window implemented
- ✅ 10 second cooldown works
- ✅ Visual feedback clear
- ✅ Can't block during cooldown
- ✅ 60 FPS maintained

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## FEATURE 7: ENHANCED HUD

### Code Review Checklist:
- [ ] Dash cooldown indicator
- [ ] Block cooldown indicator
- [ ] Circular progress bars for cooldowns
- [ ] Real-time stat updates
- [ ] Clean, readable design
- [ ] All stats displayed properly
- [ ] No overlap or clipping issues

### Files to Check:
```
/home/user/codequest/src/components/ui/HUD.jsx
```

### Test Commands:
```bash
# Check HUD component
cat /home/user/codequest/src/components/ui/HUD.jsx

# Look for cooldown indicators
grep -n "cooldown\|Cooldown" /home/user/codequest/src/components/ui/HUD.jsx
```

### Manual Testing:
1. Load game and check HUD visibility
2. Verify all stats shown (HP, Stamina, Mana, XP)
3. Use dash - verify cooldown indicator appears
4. Use block - verify cooldown indicator appears
5. Check circular progress accuracy
6. Verify real-time updates work
7. Take damage - verify HP bar updates
8. Use abilities - verify stamina/mana updates
9. Check text readability
10. Verify no UI overlap

### Visual Quality Tests:
- Check color scheme matches theme
- Verify transparency/backdrop blur
- Check font sizes are readable
- Verify cooldown circles are smooth
- Check animation smoothness

### Pass Criteria:
- ✅ All stats displayed
- ✅ Real-time updates work
- ✅ Cooldown indicators present
- ✅ Circular progress accurate
- ✅ Readable and clean
- ✅ No visual glitches
- ✅ Matches game aesthetic

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## INTEGRATION TESTING

### After all features complete:
1. Test all features work together
2. WASD movement + Camera follow
3. WASD + Dash
4. WASD + Block
5. Dash + Block cooldowns in HUD
6. Stats update during all actions
7. Performance with all features active

### Final Performance Check:
```bash
# Run the game and check browser console
# Verify 60 FPS sustained
# Check for any console errors
# Monitor memory usage
```

### Final Approval Criteria:
- ✅ All 7 features working
- ✅ 60 FPS maintained
- ✅ No console errors
- ✅ Clean code quality
- ✅ Good user experience
- ✅ All requirements met

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
