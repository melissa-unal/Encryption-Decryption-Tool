//to do:
//de modificat indicii la polybius - sunt de la 0 la 4 acum dar trebuie sa decalam cu 1 a.i. sa fie de la 1 la 5
//de rezolvat bug-ul cu splice
//de facut lower la input

const { text } = require("express");

//functia asta face deep copy la o variabila, nuj cum functioneaza dar asta face

function clone(a) 
{
    return JSON.parse(JSON.stringify(a));
}

//functia care contine cele 2 criptari consecutive - transpozitie si apoi Polybius
function encrypt(input, permutare, key)
{
    /* Sistemul de transpozitie columnara */

    //luam textul ca input din pagina pe care vrem sa il criptam
    //var input = document.getElementById("criptare").value
    
    //console.log(input);


    //luam permutarea pentru prima criptare

    //var permutare = document.getElementById("permutare").value
    var permutare_split = permutare.split(" ")

    //var permutare_split = [2,1,3,0];
    //facem deep copy la permutare pentru ca urmeaza sa o modificam

    var copy_permutare_split = clone(permutare_split)

    // for (let i=0; i<permutare_split.length; i++)
    //     console.log(parseInt(permutare_split[i]))


    //facem split la input
    var input_split = input.split(" ").join('');
    // console.log(input_split)
    // console.log(typeof(input_split))


    //console.log(input_split.length)


    //aici facem un "obiect" nou in care punem inputul si schimbam i cu j daca este cazul
    var input_split_final = [];
    for (let i = 0; i < input_split.length; i++)
        {
            if (input_split[i] != "j")
                input_split_final.push(input_split[i]);
            
            if (input_split[i] == "j")
                input_split_final.push("i");

        }
    //convertim obiectul inapoi in string si ii stergem , [ ] "
    //input_split_final = JSON.stringify(input_split_final)

    // for (let i = 0; i < input_split_final.length; i++)
    //      {
    //          if (input_split_final[i] == "," || input_split_final[i] == "[" || input_split_final[i] == "]" || input_split_final[i] == '"')
    //              input_split_final = input_split_final.replaceAll(input_split_final[i], "");
    //      }

    // console.log(input_split_final);
    // console.log(typeof(input_split_final))

    //aici modificam permutare_split si scriem permutarea de atatea ori cat este nevoie astfel incat sa fie macar de lungimea inputului dar in acelasi timp si sa fie o permutare completa (deci poate fi si mai lunga decat inputul)
    for (let i=0; i<input_split_final.length; i++)
        for (let j=0; j<permutare_split.length; j++)
        {
            if (input_split_final.length > permutare_split.length)
                {
                    permutare_split.push(permutare_split[j]);
                }
            else
                {
                    if (permutare_split.length % copy_permutare_split.length != 0 )
                    {
                        permutare_split.push(permutare_split[j]);
                    }
                }
        }    


    //in cazul in care o permutare trece ca lungime de lungimea inputului, atunci adaugam q in text pana cand se egaleaza ca lungime (asta e regula pt criptarea asta)
    for (let i=0; i<input_split_final.length; i++)
        for (let j=0; j<permutare_split.length; j++)
        {
            while (input_split_final.length < permutare_split.length)
            {
                //input_split_final = input_split_final + ',q';
                input_split_final.push("q");
            }
        }
        console.log(input_split_final)
        console.log(typeof(input_split_final))

    //facem criptarea efectiva aici folosindu-ne de permutare (aia pe care am perlucrat-o mai sus)
    var criptat = [];
    var k=0;
    for (let i = 0; i<input_split_final.length; i++)
    {
        for (let j = 0; j<copy_permutare_split.length; j++)
        {
            if (i%copy_permutare_split.length == permutare_split[j])
            {
                if (criptat[k+j] == null)
                {
                    criptat[k+j] = input_split_final[i];
                }
                else
                {
                    k = k + j+copy_permutare_split.length;
                    criptat[k] =input_split_final[i];
                    k=i;
                }
            }
        }
    }
        console.log("Permutare cu transpozitie columnara: ")
        //console.log(permutare_split)
        console.log("Criptat cu transpozitie columnara")
        console.log(criptat)
        //console.log(permutare_split.length)


    /* Patratul lui Polybius */

    //aici facem cea de-a doua criptare

    //luam cheia pentru patratul lui Polybius
    //var key = document.getElementById("cheie_Polybius").value
    //console.log(key);

    var m = [
                ["","","","",""],
                ["","","","",""],
                ["","","","",""],
                ["","","","",""],
                ["","","","",""]
            ]

    var lista = ['a','b','c','d','e','f','g','h','i','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']

    function unic(cuvant) 
    {
        var final = '';
        for(var i = 0; i < cuvant.length; i++) 
        {
            if(final.indexOf(cuvant[i]) < 0) 
            {
                final = final + cuvant[i];
            }
        }
        return final;
    }

    key_final = unic(key)
    //console.log(key_final)

    //ideea generala: parcurgem lista de mai sus si cheia, si cand literele din cheie se regasesc in lista le stergem - facem asta pt ca apoi sa punem cheia in matrice si restul pozitiilor ramase din matrice o sa fie inlocuite pe rand cu ce ramane din lista
    for (let i = 0; i < lista.length; i++)
        for (let j =0; j < key_final.length; j++)
            {
                if (lista[i] == key_final[j])
                    lista[i] = "";
            }
    
    //aici elimin (teoretic pt ca practic nu merge mereu) toate pozitiile din lista din care am scos literele din cheie
    //are un bug -needs to be fixed (uneori nu elimina toate pozitiile goale) 
    //-- fixed


    // for (let i = 0; i < lista.length; i++)
    // {
    //         if (lista[i] == "")
    //             lista.splice(i, 1)
    // }

    // for (let i = lista.length-1; i >= 0; i--)
    // {
    //         if (lista[i] == "")
    //             lista.splice(i, 1)
    // } 
    lista_final = []
        for (let i = 0; i < lista.length; i++)
        {
            if (lista[i] != "")
            {
                lista_final.push(lista[i]);
            }
        }
    console.log(lista_final)



    //aici am pus in matrice cheia asa pentru ca efectiv nu stiam cum altfel :)) noroc ca e mereu matrice de 5x5
    for (let i = 0; i < m.length; i++)
        for (let j = 0; j < m.length; j++)
            for (let k = 0; k < key_final.length; k++)
            {
                // if (i==0 && k == j)
                //     m[i][j] = key_final[k]

                // if (i==1 && k == j)
                //     m[i][j] = key_final[k+5]

                // if (i==2 && k == j)
                //     m[i][j] = key_final[k+10]
                
                // if (i==3 && k == j)
                //     m[i][j] = key_final[k+15]
                
                // if (i==4 && k == j)
                //     m[i][j] = key_final[k+20]


                //mi-am dat seama aici pana la urma
                if (k == j)
                {
                    m[i][j] = key_final[k+m.length*i]
                }
            }

    //completez matricea cu restul literelor din lista
    for (let i = 0; i < m.length; i++)
        for (let j = 0; j < m.length; j++)
        {
            if (m[i][j] == null)
                m[i][j] = ""
        }

    var k=0;
    for (let i = 0; i < m.length; i++)
        for (let j = 0; j < m.length; j++)
        {
            if (m[i][j] == "")
            {
                m[i][j] = lista_final[k];
                k=k+1;
            }
        }
    console.log(m)

    //fac criptarea - iau un array si caut din matrice indicii fiecarei litere din inputul meu si cand le gasesc dau push in array la indici
    cheie_criptata = [];
    for (let k = 0; k < criptat.length; k++)
        for (let i = 0; i < m.length; i++)
            for (let j = 0; j < m.length; j++)
            {
                if (criptat[k] == m[i][j])
                {
                    //cheie_criptata = cheie_criptata + i.toString + j.toString;
                    cheie_criptata.push(i);
                    cheie_criptata.push(j);
                }
            }

    for (let i=0; i<cheie_criptata.length; i++)
    {
        cheie_criptata[i]+=1;
    }
    console.log(cheie_criptata)
    console.log(typeof(cheie_criptata))
    return cheie_criptata.join("");
}



function decrypt(input, permutare, key)
{
    //luam sirul de numere criptat ca input pentru a face decriptarea
    //var input = document.getElementById("criptare").value
    //console.log(input);

    //luam cheia pentru patratul lui Polybius
    //var key = document.getElementById("cheie_Polybius").value
    //console.log(key);

    var m = [
        ["","","","",""],
        ["","","","",""],
        ["","","","",""],
        ["","","","",""],
        ["","","","",""]
    ]

    var lista = ['a','b','c','d','e','f','g','h','i','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']

    for (let i = 0; i < lista.length; i++)
        for (let j =0; j < key.length; j++)
            {
                if (lista[i] == key[j])
                    lista[i] = "";
            }


    // for (let i = 0; i < lista.length; i++)
    // {
    //         if (lista[i] == "")
    //             lista.splice(i, 1)
    // }

    // for (let i = lista.length-1; i >= 0; i--)
    // {
    //         if (lista[i] == "")
    //             lista.splice(i, 1)
    // } 
    // console.log(lista)

    lista_final = []
        for (let i = 0; i < lista.length; i++)
        {
            if (lista[i] != "")
            {
                lista_final.push(lista[i]);
            }
        }
        console.log(lista_final)


    function unic(cuvant) 
    {
        var final = '';
        for(var i = 0; i < cuvant.length; i++) 
        {
            if(final.indexOf(cuvant[i]) < 0) 
            {
                final = final + cuvant[i];
            }
        }
        return final;
    }

    key_final = unic(key)


    for (let i = 0; i < m.length; i++)
        for (let j = 0; j < m.length; j++)
            for (let k = 0; k < key_final.length; k++)
            {
                // if (i==0 && k == j)
                //     m[i][j] = key_final[k]

                // if (i==1 && k == j)
                //     m[i][j] = key_final[k+5]

                // if (i==2 && k == j)
                //     m[i][j] = key_final[k+10]
                
                // if (i==3 && k == j)
                //     m[i][j] = key_final[k+15]
                
                // if (i==4 && k == j)
                //     m[i][j] = key_final[k+20]


                if (k ==j)
                {
                    m[i][j] = key_final[k+m.length*i]
                }
            }
    for (let i = 0; i < m.length; i++)
        for (let j = 0; j < m.length; j++)
        {
            if (m[i][j] == null)
                m[i][j] = ""
        }
    var k=0;
    for (let i = 0; i < m.length; i++)
        for (let j = 0; j < m.length; j++)
        {
            if (m[i][j] == "")
            {
                m[i][j] = lista_final[k];
                k=k+1;
            }
        }
    console.log(m)

    var input_final = input.split(''); 
    for (let i = 0; i < input_final.length; i++)
    input_final[i] -=1;
    // console.log("AICI MELLIEEEEEE")
    // console.log(input_final)
    // console.log(typeof(input_final));

    cheie_decriptata1 =[];
    for (let k = 0; k < input_final.length; k+=2)
        for (let i = 0; i < m.length; i++)
            for (let j = 0; j < m.length; j++)
            {
                if (input_final[k] == i && input_final[k+1] == j)
                {
                    cheie_decriptata1 = cheie_decriptata1 + m[i][j];
                }
            }


    //luam permutarea pentru a doua decriptare
    //var permutare = document.getElementById("permutare").value
    var permutare_split = permutare.split(" ")

    
    // for (let i=0; i<permutare_split.length; i++)
    //     console.log(parseInt(permutare_split[i]))
    
    
    var permutare_split_inversa = [];

    //luam inversa permutarii
    j=0;
    for (let i=0; i<permutare_split.length; i++)
    {
        j = permutare_split[i];
        permutare_split_inversa[j] =i;
        j++;
    }
    console.log(permutare_split_inversa)

    //facem deep copy la inversa permutarii pentru ca urmeaza sa stricam originalul
    var copy_permutare_split_inversa = clone(permutare_split_inversa)

    console.log(cheie_decriptata1)

    for (let i=0; i<cheie_decriptata1.length; i++)
        for (let j=0; j<permutare_split_inversa.length; j++)
        {
            if (cheie_decriptata1.length > permutare_split_inversa.length)
                {
                    permutare_split_inversa.push(permutare_split_inversa[j])
                }
            else
                {
                    if (permutare_split_inversa.length % copy_permutare_split_inversa.length != 0 )
                    {
                        permutare_split_inversa.push(permutare_split_inversa[j]);
                    }
                }    
        }
    
    for (let i=0; i<cheie_decriptata1.length; i++)
        for (let j=0; j<permutare_split_inversa.length; j++)
        {
            while (cheie_decriptata1.length < permutare_split_inversa.length)
            {
                cheie_decriptata1 = cheie_decriptata1 + "q";
            }
        }
    console.log("Cheie decriptata")
    console.log(cheie_decriptata1)

        
    var decriptat = [];
    var k=0
    for (let i = 0; i<cheie_decriptata1.length; i++)
    {
        for (let j = 0; j<copy_permutare_split_inversa.length; j++)
        {
            if (i%copy_permutare_split_inversa.length == permutare_split_inversa[j])
            {
                if (decriptat[k+j] == null)
                {
                    decriptat[k+j] = cheie_decriptata1[i];
                }
                else
                {
                    k = k + j+copy_permutare_split_inversa.length;
                    decriptat[k] =cheie_decriptata1[i];
                    k=i;
                }
            }
        }
    }
        //console.log(permutare_split_inversa)
        //console.log(copy_permutare_split_inversa)
        console.log(decriptat);
        return decriptat;
        //console.log(permutare_split.length)

}

exports.encrypt = encrypt
exports.decrypt = decrypt