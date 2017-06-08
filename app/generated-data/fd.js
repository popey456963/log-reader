let words = `fd me,spagh and wizard 2 spd 0.1 grav and i get deathwish
fd me tinko and 3 random t 0.2 grav and 3 speed fd
fd me knekk azzar and tin gets 0.3 speed for defying my logic
fd me and sorso with botwh 0.1 gravity 2 speed :)
ez fd 2 rounds in row
fd for me and mikal nr
fd fm next 3 rounds, fd for michiel nr, od baddy nr
fd me next 3 rounds
fd me sorso daddy and tei & staff that play as ct can change their speed whenever they want 2
fd me epic and TEI ct's get 10 speed 
fd me broseidon and your mom 2 speed 0.3 grav
so fd me, ur mom, lopex with 2 speed 0.3 grav
fd alexander and dead eye, 12 speed lazy master
fd mr and @random fd/od nr?
FD me, fd/od @random, taua gets 0.3 speed.
fd me meep, lakim and yoda nr 0.2 grav and 3 speed fd
fd me danny nr we get usps
fd me danny nr. danny gets zeus
fd me, gunner and 2 random t's, 0.2 grav and 3 speed fd and dw`.split('\n')

let fd = false

for (let item of words) {
  let object = {}
  for (let word of [].concat.apply([], item.split(' ').map((item) => { return item.split(',') }))) {
    if (word == 'fd') {
      fd = true
    } else if ()
  }
}