module.exports.error = [
  /^HRTF: Not enough data, wanted [0-9]+, got [0-9]+/,
  /^GetSpriteAxes/,
  /^      [0-9]{8} [0-9]+ [0-9]+/,
  /^  [a-z]{3}: [0-9]+ms via/,
  /Shutdown function/,
  /^CreateEvent:/,
  /^Failed to read the default inventory image file/,
  /Steamworks gamestats/,
  /Stopping All Sounds\.\.\./,
  /Chrome HTML image for/,
  /Error getting chrome HTML image/,
  /^Avatar image for user /,
  /Host_WriteConfiguration:/,
  /^Shutdown .* predictable entities/,
  /^Stopping: Channel:/,
  /^CLoadingScreenScaleform/,
  /^Notification CDN download result/,
  /IME Component/,
  /^--- Missing Vgui material /,
  /^Forced rebuild of bsp cache sound/,
  /^Datacenter::EnableUpdate/,
  /^Texture .* not found./,
  /^Model .* has skin but thinks it can render fastpath/,
  /^CScaleformComponent_ImageCache evicting/,
  /^Missing Vgui material/,
  /^Request for .* succeeded/,
  /Bad sequence in GetSequenceName\(\) for model /,
  /Failed, using default cubemap /,
  /Inventory image for item/,
  /^CSysSessionClient::Process_ReplyJoinData_Our/,
  /^Queued Material System: DISABLED!/,
  /^Couldn't get HDR /,
  /Failed to load gamerulescvars.txt, game rules cvars might not be reported to management tools\./,
  /Parent cvar in client.dll not allowed /,
  /Binding uncached material .*, artificially incrementing refcount/,
  /.* : material ".*" not found\./,
  /material ".*" not found\./,
  / used on world geometry without rebuilding map\./,
  /.*::Initialize: .* failed for entity/,
  /.*:  Reinitialized .* predictable entities/,
  /can't be found on disk/,
  /CMaterial::PrecacheVars: error loading vmt file for/,
  /-------------------------/,
  /Bad sequence (.*) in .* for model .*!/,
  /^\[CreateExplosionIed\] Spawning env_explosion! \[.*\]/,
  /^\[IED\] .* was set to prop_exploding_barrel/,
  /^\[open location\]/,
  /^\[requested default spray\]/,
  /^Disabling damage on button/,
  /^@.*:choke\(.*\) \(peak at .*%\)/,
  /^Error: Total static audio channels have been used:/,
  /^SetConVar: No such cvar/
]

module.exports.misc = [
  /====csgo_gc_show_matchmaking_stats====/,
  /======================================/,
  /\[.*\] -> \[.* damaged .* for [0-9]+ damage with .*]/, // TTT Damage
]

module.exports.list = {
  kills: [
    'Kills',
    {
      'world_kill': 'World Kill',
      'red_kill': 'Red Kill',
      'pink_kill': 'Pink Kill',
      'normal_kill': 'Normal Kill'
    }
  ],
  actions: [
    'Actions',
    {
      'button': 'Button Presses',
      'cell_button': 'Cell Button',
      'damage_given': 'Damage Given',
      'damage_taken': 'Damage Taken',
      'warden': 'Warden Selected',
      'msg': 'Messages',
      'pm_msg': 'Private Messages'
    }
  ],
  debug: [
    'Debug',
    {
      'balancer': 'Balancing Operations',
      'weapon_boost': 'Weapon Boosts',
      'upgrades': 'Upgrades',
      'spray': 'Sprays',
      'tasers': 'Spawning Tasers',
      'warden_debug': 'Warden Debug',
      'drops': 'Drops',
      'zones': 'Zones'
    }
  ],
  csgo: [
    'CSGO',
    {
      'convar': 'Altered Convars',
      'connected': 'Connected Players',
      'unknown_command': 'Unknown Commands',
      'failed_send': 'SM Network Issues',
      'lobby_set_data': 'Lobby Data',
      'round_start': 'Round Seperator'
    }
  ],
  ttt: [
    'TTT',
    {
      'ttt_role': 'Role Selection',
      'ttt_damage': 'Damage Logs',
      'ttt_kill': 'Kill Logs',
      'ttt_tase': 'Tase Logs',
      'ttt': 'Other TTT Msgs'
    }
  ]
}

module.exports.type = {
  'begin_matchmaking_section': [/====csgo_gc_show_matchmaking_stats====/, []],
  'end_matchmaking_section': [/======================================/, []],
  'begin_ttt_logs': [/---------------TTT LOGS---------------/, []],
  'end_ttt_logs': [/--------------------------------------/, []],
  'begin_damage_given': [/Player: .* - Damage Given/, []], // DONE
  'damage_given': [/Damage Given to "(.*)" - (.*) in (.*) hit{0,1}/, ['player', 'damage', 'hits']], // DONE
  'begin_damage_taken': [/Player: .* - Damage Taken/, []], // DONE
  'damage_taken': [/Damage Taken from "(.*)" - (.*) in (.*) hit{0,1}/, ['player', 'damage', 'hits']], // DONE
  'world_kill': [/\[([0-9]+:[0-9]+:[0-9]+)\].*\[(.*)\] @tx([0-9]+) @px([0-9]+) died from '(.*)'/, ['time', 'player', 'time_slot', 'position_slot', 'killer']], // DONE
  'red_kill': [/\[([0-9]+:[0-9]+:[0-9]+)\] .*Red kill by .*\[(.*)\] on \[(.*)\] stck\[([-0-9]+)\] fz\[([-0-9]+)\] ljmp\[([-0-9]+)\] lcrh\[([-0-9]+)\] lpckup\[([-0-9]+)\] dir\[(.*)\] reason\[(.*)\]/, ['time', 'killer', 'player', 'stack', 'freeze', 'jump', 'crouch', 'pickup', 'direction', 'reason']], // DONE
  'pink_kill': [/\[([0-9]+:[0-9]+:[0-9]+)\] .*Pink kill by .*\[(.*)\] on \[(.*)\] @tx-([-0-9]+) @px-([-0-9]+) fd\[([-0-9]+)\] stck\[([-0-9]+)\] fz\[([-0-9]+)\] ljmp\[([-0-9]+)\] lcrh\[([-0-9]+)\] lpckup\[([-0-9]+)\] dir\[(.*)\]/, ['time', 'killer', 'player', 'tx', 'px', 'freeday', 'stack', 'freeze', 'jump', 'crouch', 'pickup', 'direction']], // DONE
  'normal_kill': [/\[([0-9]+:[0-9]+:[0-9]+)\] .*Non red kill by .*\[(.*)\] on \[(.*)\] @tx([-0-9]+) @px([-0-9]+) fd\[([-0-9]+)\] stck\[([-0-9]+)\] fz\[([-0-9]+)\] ljmp\[([-0-9]+)\] lcrh\[([-0-9]+)\] lpckup\[([-0-9]+)\] dir\[(.*)\]/, ['time', 'killer', 'player', 'tx', 'px', 'freeday', 'stack', 'freeze', 'jump', 'crouch', 'pickup', 'direction']], // DONE
  'button': [/\[[0-9]+:[0-9]+:[0-9]+\]- \[.*\] activated \[.*\]\[[0-9]+\]\[[0-9]+\] button/, []], // DONE
  'cell_button': [/'.*' pressed cellbutton/, []],
  'begin_settings': [/settings {|    ExtendedServerInfo {|Settings {/, []],
  'balancer': [/\[balancer\] .* Switch worked setting g_iSwithchingTo to 0/, []],
  'connected': [/ connected\.$/, []], // DONE
  'weapon_boost': [/\[Weapon Boost\] Boosting awp damage with \[.*\] from \[.*\] to \[.*\]/, []],
  'unknown_command': [/Tried to look up command say as if it were a variable\./, []],
  'failed_send': [/\[SM\] Failed to send/, []],
  'upgrades': [/^\[upgrades\] /, []],
  'convar': [/SetConVar: (.*) = "(.*)"/, ['convar', 'value']],
  'spray': [/^\[spray\]/, []],
  'tasers': [/^\[taser\] Spawning .* tasers/, []],
  'round_start': [/----------------\[Round Start\]----------------/, ''],
  'warden_debug': [/\[Warden Debug\] /, []],
  'warden': [/[[0-9]+:[0-9]+:[0-9]+\] Your warden for today is .*/, []],
  'msg': [/>(\[DEAD\])?(\[TEAM\])?(\[♥\]\[(.*)\])?(\[.*\])?(?:)?(.*): (.*)/, ['dead', 'team', 'rank', 'donator', 'donator', 'user', 'message']],
  'pm_msg': [/>.*\[.*->.*\]/, []],
  'drops': [/\[drops\]/, []],
  'zones': [/\[zones\]/, []],
  'lobby_set_data': [/^LobbySetData:/, []],
  'ttt_role': [/^ \[TTT\] You are {0,1}a{0,1} (.*)/, ['role']],
  'ttt_damage': [/^\[[0-9]+:[0-9]+] -> \[(.*) \((.*)\) damaged (.*) \((.*)\) for (.*) damage with (.*)\](?: - (BAD ACTION))?/, []],
  'ttt_kill': [/^\[[0-9]+:[0-9]+] -> \[(.*) \((.*)\) killed (.*) \((.*)\) with (.*)\](?: - (BAD ACTION))?/, []],
  'ttt_tase': [/^-> \[(.*) \((.*)\) was tased by (.*)\]/, []],
  'ttt': [/^ \[TTT\] /, undefined]
}