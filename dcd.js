console.log('dcd.js loaded')

DCD=function(url,fun){
    if(url){
        this.url=url
        DCD.read(url,this,fun)
    }
}

DCD.read=function(url,that,fun){
    if(typeof(url)=='string'){ // get file first
        console.log('reading '+url)      
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function(e) {
          if (this.status == 200) {
            // get binary data as a response
            var responseArray = new Uint32Array(this.response)
            DCD.read(responseArray,that,fun)
          }
        };

        xhr.send();
    }else{ // process arrayed response
        // http://www.ks.uiuc.edu/Research/namd/2.9/ug/node11.html
        //
        // DCD trajectory files
        //
        // NAMD produces DCD trajectory files in the same format as X-PLOR and CHARMM. The DCD files are single precision binary FORTRAN files, so are transportable between computer architectures. The file readers in NAMD and VMD can detect and adapt to the endianness of the machine on which the DCD file was written, and the utility program flipdcd is also provided to reformat these files if needed. The exact format of these files is very ugly but supported by a wide range of analysis and display programs. The timestep is stored in the DCD file in NAMD internal units and must be multiplied by TIMEFACTOR=48.88821 to convert to fs. Positions in DCD files are stored in Å. Velocities in DCD files are stored in NAMD internal units and must be multiplied by PDBVELFACTOR=20.45482706 to convert to Å/ps. Forces in DCD files are stored in kcal/mol/Å.
        //
        // NAMD binary files
        // NAMD uses a trivial double-precision binary file format for coordinates, velocities, and forces. Due to its high precision this is the default output and restart format. VMD refers to these files as the ``namdbin'' format. The file consists of the atom count as a 32-bit integer followed by all three position or velocity components for each atom as 64-bit double-precision floating point, i.e., NXYZXYZXYZXYZ... where N is a 4-byte int and X, Y, and Z are 8-byte doubles. If the number of atoms the file contains is known then the atom count can be used to determine endianness. The file readers in NAMD and VMD can detect and adapt to the endianness of the machine on which the binary file was written, and the utility program flipbinpdb is also provided to reformat these files if needed. Positions in NAMD binary files are stored in Å. Velocities in NAMD binary files are stored in NAMD internal units and must be multiplied by PDBVELFACTOR=20.45482706 to convert to Å/ps. Forces in NAMD binary files are stored in kcal/mol/Å.
        
        var xyz=[[],[],[]]
        url.forEach(function(v,i){
            xyz[i%3].push(v)
        })
        that.xyz=xyz
        if(fun){fun()}
    }

    return ':-O'

}

//dcd = new DCD('sample_trajectory_file.dcd')
//console.log(dcd)

// if dcd file being passed as the hash

if(location.hash.length>0){
    (function(){
        var parm={}
        location.hash.slice(1).split('&').map(function(hh){
            var av=[]
            hh.split('=').map(function(x){
                av.push(x)
            })
            parm[av[0]]=av[1]
            4
        })
        if(parm.dcdUrl){
            dcd = new DCD(parm.dcdUrl,function(){
                console.log(dcd.xyz)
                var div = document.getElementById('dcdDiv')
                div.innerHTML='<h3>the first 1000 ...</h3>' // reset div
                if(div){
                    tb = document.createElement('table')
                    tb.className="table table-striped"
                    var th = document.createElement('thead')
                    th.innerHTML='<tr><td>X</td><td>Y</td><td>Z</td></tr>'
                    tb.appendChild(th)
                    div.appendChild(tb)
                    var tbd = document.createElement('tbody')
                    var h = []
                    for(var i=0;i<1000;i++){
                        h.push('<tr><td>'+dcd.xyz[0][i]+'</td><td>'+dcd.xyz[1][i]+'</td><td>'+dcd.xyz[2][i]+'</td></tr>')
                    }
                    tbd.innerHTML=h.join('')
                    tb.appendChild(tbd)
                }
            })
        }
        4
    })()
}