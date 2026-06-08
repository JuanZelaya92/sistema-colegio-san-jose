const SUPABASE_URL = "https://mknlymjktjkpoyzvapaw.supabase.co";
const SUPABASE_KEY = "sb_publishable_XiCg-vbckayRlCo8723A0g_cnGkJUQQ";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const LIMITE_FALTAS = 25;

const MESES_ASISTENCIA = [
    { numero: 3, nombre: "Marzo" },
    { numero: 4, nombre: "Abril" },
    { numero: 5, nombre: "Mayo" },
    { numero: 6, nombre: "Junio" },
    { numero: 7, nombre: "Julio" },
    { numero: 8, nombre: "Agosto" },
    { numero: 9, nombre: "Septiembre" },
    { numero: 10, nombre: "Octubre" },
    { numero: 11, nombre: "Noviembre" }
];

const config = {
    alumnos: {
        pk: "id_alumno",
        titulo: "Alumnos",
        columnas: [
            "id_alumno",
            "nombre",
            "apellido",
            "dni",
            "fecha_nacimiento",
            "direccion",
            "telefono",
            "email",
            "tutor_a_cargo",
            "parentesco_tutor"
        ]
    },

    cursos: {
        pk: "id_curso",
        titulo: "Cursos",
        columnas: [
            "id_curso",
            "nombre_curso",
            "turno",
            "aula"
        ]
    },

    docentes: {
        pk: "id_docente",
        titulo: "Docentes",
        columnas: [
            "id_docente",
            "nombre",
            "apellido",
            "dni",
            "telefono",
            "email"
        ]
    },

    materias: {
        pk: "id_materia",
        titulo: "Materias",
        columnas: [
            "id_materia",
            "nombre_materia"
        ]
    },

    cuotas: {
        pk: "id_cuota",
        titulo: "Cuotas",
        columnas: [
            "id_cuota",
            "id_alumno",
            "monto",
            "fecha_vencimiento",
            "estado"
        ]
    },

    notas: {
        pk: "id_nota",
        titulo: "Notas",
        columnas: [
            "id_nota",
            "id_alumno",
            "id_materia",
            "nota",
            "fecha",
            "trimestre",
            "nota_final",
            "estado_final"
        ]
    },

    inscripciones: {
        pk: "id_inscripcion",
        titulo: "Inscripciones",
        columnas: [
            "id_inscripcion",
            "id_alumno",
            "id_curso",
            "fecha_inscripcion",
            "ciclo_lectivo",
            "estado"
        ]
    },

    actas: {
        pk: "id_acta",
        titulo: "Actas",
        columnas: [
            "id_acta",
            "id_alumno",
            "fecha",
            "tipo",
            "motivo",
            "descripcion",
            "estado"
        ]
    },

    asistencias: {
        pk: "id_asistencia",
        titulo: "Inasistencias",
        columnas: [
            "id_asistencia",
            "id_alumno",
            "fecha",
            "estado"
        ]
    }
};

function nombreColumna(columna) {
    const nombres = {
        numero: "N°",

        id_alumno: "ID alumno",
        id_docente: "ID docente",
        id_materia: "ID materia",
        id_curso: "ID curso",
        id_cuota: "ID cuota",
        id_nota: "ID nota",
        id_inscripcion: "ID inscripción",
        id_acta: "ID acta",
        id_asistencia: "ID asistencia",

        nombre: "Nombre",
        apellido: "Apellido",
        dni: "DNI",
        telefono: "Teléfono",
        email: "Email",
        direccion: "Dirección",
        fecha_nacimiento: "Fecha nacimiento",

        tutor_a_cargo: "Tutor a cargo",
        parentesco_tutor: "Parentesco tutor",

        nombre_curso: "Curso",
        turno: "Turno",
        aula: "Aula",

        nombre_materia: "Materia",
        materia: "Materia",
        docente: "Docente",
        alumno: "Alumno",
        curso: "Curso",

        monto: "Monto",
        fecha_vencimiento: "Vencimiento",
        fecha_inscripcion: "Fecha inscripción",
        ciclo_lectivo: "Ciclo lectivo",

        estado: "Estado",
        fecha: "Fecha",
        nota: "Nota",
        trimestre: "Trimestre",

        primer_trimestre: "1° trimestre",
        segundo_trimestre: "2° trimestre",
        tercer_trimestre: "3° trimestre",

        nota_final: "Nota final",
        estado_final: "Estado final",

        tipo: "Tipo",
        motivo: "Motivo",
        descripcion: "Descripción",

        mes: "Mes",
        ausencias: "Ausencias",
        tardes: "Tardes",
        justificadas: "Justificadas",
        total_faltas: "Total faltas",
        limite: "Límite",
        restantes: "Restantes",
        estado_asistencia: "Estado",

        acciones: ""
    };

    return nombres[columna] || columna.replaceAll("_", " ");
}

function claseEstado(estado) {
    if (!estado) return "";

    const e = String(estado).toLowerCase();

    if (
        e.includes("pagada") ||
        e.includes("aprobado") ||
        e.includes("activo") ||
        e.includes("resuelta") ||
        e.includes("notificada") ||
        e.includes("normal") ||
        e.includes("justificada")
    ) {
        return "estado-ok";
    }

    if (
        e.includes("pendiente") ||
        e.includes("riesgo") ||
        e.includes("tarde")
    ) {
        return "estado-pendiente";
    }

    if (
        e.includes("desaprobado") ||
        e.includes("vencida") ||
        e.includes("baja") ||
        e.includes("libre") ||
        e.includes("ausente")
    ) {
        return "estado-error";
    }

    return "";
}

function calcularValorFalta(estado) {
    if (!estado) return 0;

    const e = String(estado).toLowerCase();

    if (e.includes("ausente")) return 1;
    if (e.includes("tarde") || e.includes("media")) return 0.5;
    if (e.includes("justificada")) return 0;
    if (e.includes("presente")) return 0;

    return 0;
}

function calcularEstadoAsistencia(totalFaltas) {
    if (totalFaltas >= 25) return "Libre";
    if (totalFaltas >= 20) return "En riesgo";
    return "Normal";
}

function formatearNumero(valor) {
    if (Number.isInteger(valor)) return valor;
    return valor.toFixed(1);
}

function iconoVer() {
    return `<i class="fas fa-eye"></i>`;
}

function iconoEditar() {
    return `<i class="fas fa-pen"></i>`;
}

function iconoEliminar() {
    return `<i class="fas fa-trash"></i>`;
}

async function cargarDashboard() {
    const resultado = document.getElementById("resultado");

    const tablas = [
        "alumnos",
        "cursos",
        "docentes",
        "materias",
        "cuotas",
        "actas"
    ];

    let cards = "";

    for (const tabla of tablas) {
        const { count } = await supabaseClient
            .from(tabla)
            .select("*", { count: "exact", head: true });

        cards += `
            <div class="card">
                <h3>${config[tabla].titulo}</h3>
                <p>${count ?? 0}</p>
            </div>
        `;
    }

    resultado.innerHTML = `
        <h2>Dashboard general</h2>
        <div class="cards">${cards}</div>
    `;
}

async function cargarModulo(tabla) {
    if (tabla === "inscripciones") {
        await cargarInscripciones();
        return;
    }

    if (tabla === "cuotas") {
        await cargarCuotas();
        return;
    }

    if (tabla === "notas") {
        await cargarNotas();
        return;
    }

    if (tabla === "actas") {
        await cargarActas();
        return;
    }

    if (tabla === "asistencias") {
        await cargarAsistencias();
        return;
    }

    const c = config[tabla];
    const resultado = document.getElementById("resultado");

    const { data, error } = await supabaseClient
        .from(tabla)
        .select("*")
        .order(c.pk, { ascending: true })
        .limit(100);

    if (error) {
        resultado.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        return;
    }

    renderModuloGeneral(tabla, data);
}

function renderModuloGeneral(tabla, data) {
    const c = config[tabla];
    const resultado = document.getElementById("resultado");

    let html = `
        <div class="topbar">
            <h2>${c.titulo}</h2>
            <button onclick="agregarRegistro('${tabla}')">Agregar</button>
        </div>

        <input class="buscador" type="text" placeholder="Buscar..." onkeyup="filtrarTabla(this.value)">

        <div class="table-container">
            <table id="tablaDatos">
                <thead>
                    <tr>
    `;

    c.columnas.forEach(col => {
        html += `<th>${nombreColumna(col)}</th>`;
    });

    html += `<th></th></tr></thead><tbody>`;

    data.forEach(fila => {
        html += "<tr>";

        c.columnas.forEach(col => {
            html += `<td>${fila[col] ?? ""}</td>`;
        });

        html += `
            <td class="acciones-celda">

                ${tabla === "alumnos" ? `
                    <button class="small" title="Ver ficha" onclick="verAlumno(${fila[c.pk]})">
                        ${iconoVer()}
                    </button>
                ` : ""}

                ${tabla === "cursos" ? `
                    <button class="small" title="Ver curso" onclick="verCurso(${fila[c.pk]})">
                        ${iconoVer()}
                    </button>
                ` : ""}

                <button class="small edit" title="Editar" onclick="editarRegistro('${tabla}', ${fila[c.pk]})">
                    ${iconoEditar()}
                </button>

                <button class="small delete" title="Eliminar" onclick="eliminarRegistro('${tabla}', ${fila[c.pk]})">
                    ${iconoEliminar()}
                </button>

            </td>
        `;

        html += "</tr>";
    });

    html += "</tbody></table></div>";
    resultado.innerHTML = html;
}

async function cargarInscripciones() {
    const { data: inscripciones, error } = await supabaseClient
        .from("inscripciones")
        .select("*")
        .order("id_inscripcion", { ascending: true })
        .limit(100);

    if (error) {
        document.getElementById("resultado").innerHTML = `<p class="error">Error: ${error.message}</p>`;
        return;
    }

    const { data: alumnos } = await supabaseClient
        .from("alumnos")
        .select("id_alumno, nombre, apellido, dni");

    const { data: cursos } = await supabaseClient
        .from("cursos")
        .select("id_curso, nombre_curso");

    const datos = inscripciones.map(inscripcion => {
        const alumno = alumnos.find(a => a.id_alumno === inscripcion.id_alumno);
        const curso = cursos.find(c => c.id_curso === inscripcion.id_curso);

        return {
            id_inscripcion: inscripcion.id_inscripcion,
            alumno: alumno ? `${alumno.nombre} ${alumno.apellido}` : inscripcion.id_alumno,
            dni: alumno ? alumno.dni : "",
            curso: curso ? curso.nombre_curso : inscripcion.id_curso,
            fecha_inscripcion: inscripcion.fecha_inscripcion,
            ciclo_lectivo: inscripcion.ciclo_lectivo,
            estado: inscripcion.estado
        };
    });

    renderTablaEspecial({
        titulo: "Inscripciones",
        placeholder: "Buscar alumno curso DNI...",
        datos,
        columnas: [
            "id_inscripcion",
            "alumno",
            "dni",
            "curso",
            "fecha_inscripcion",
            "ciclo_lectivo",
            "estado"
        ],
        tablaOriginal: "inscripciones",
        pk: "id_inscripcion"
    });
}

async function cargarCuotas() {
    const { data: cuotas, error } = await supabaseClient
        .from("cuotas")
        .select("*")
        .order("id_cuota", { ascending: true })
        .limit(100);

    if (error) {
        document.getElementById("resultado").innerHTML = `<p class="error">Error: ${error.message}</p>`;
        return;
    }

    const { data: alumnos } = await supabaseClient
        .from("alumnos")
        .select("id_alumno, nombre, apellido, dni");

    const datos = cuotas.map(cuota => {
        const alumno = alumnos.find(a => a.id_alumno === cuota.id_alumno);

        return {
            id_cuota: cuota.id_cuota,
            alumno: alumno ? `${alumno.nombre} ${alumno.apellido}` : cuota.id_alumno,
            monto: cuota.monto,
            fecha_vencimiento: cuota.fecha_vencimiento,
            estado: cuota.estado
        };
    });

    renderTablaEspecial({
        titulo: "Cuotas",
        placeholder: "Buscar alumno estado vencimiento...",
        datos,
        columnas: [
            "id_cuota",
            "alumno",
            "monto",
            "fecha_vencimiento",
            "estado"
        ],
        tablaOriginal: "cuotas",
        pk: "id_cuota"
    });
}

async function cargarNotas() {
    const { data: notas, error } = await supabaseClient
        .from("notas")
        .select("*")
        .order("id_nota", { ascending: true })
        .limit(100);

    if (error) {
        document.getElementById("resultado").innerHTML = `<p class="error">Error: ${error.message}</p>`;
        return;
    }

    const { data: alumnos } = await supabaseClient
        .from("alumnos")
        .select("id_alumno, nombre, apellido, dni");

    const { data: materias } = await supabaseClient
        .from("materias")
        .select("id_materia, nombre_materia");

    const datos = notas.map(nota => {
        const alumno = alumnos.find(a => a.id_alumno === nota.id_alumno);
        const materia = materias.find(m => m.id_materia === nota.id_materia);

        return {
            id_nota: nota.id_nota,
            alumno: alumno ? `${alumno.nombre} ${alumno.apellido}` : nota.id_alumno,
            materia: materia ? materia.nombre_materia : nota.id_materia,
            nota: nota.nota,
            fecha: nota.fecha,
            trimestre: nota.trimestre,
            nota_final: nota.nota_final,
            estado_final: nota.estado_final
        };
    });

    renderTablaEspecial({
        titulo: "Notas",
        placeholder: "Buscar alumno materia estado...",
        datos,
        columnas: [
            "id_nota",
            "alumno",
            "materia",
            "nota",
            "fecha",
            "trimestre",
            "nota_final",
            "estado_final"
        ],
        tablaOriginal: "notas",
        pk: "id_nota"
    });
}

async function cargarActas() {
    const { data: actas, error } = await supabaseClient
        .from("actas")
        .select("*")
        .order("fecha", { ascending: false })
        .limit(100);

    if (error) {
        document.getElementById("resultado").innerHTML = `<p class="error">Error: ${error.message}</p>`;
        return;
    }

    const { data: alumnos } = await supabaseClient
        .from("alumnos")
        .select("id_alumno, nombre, apellido, dni");

    const { data: inscripciones } = await supabaseClient
        .from("inscripciones")
        .select("*");

    const { data: cursos } = await supabaseClient
        .from("cursos")
        .select("*");

    const datos = actas.map(acta => {
        const alumno = alumnos.find(a => a.id_alumno === acta.id_alumno);
        const inscripcion = inscripciones.find(i => i.id_alumno === acta.id_alumno);
        const curso = inscripcion ? cursos.find(c => c.id_curso === inscripcion.id_curso) : null;

        return {
            alumno: alumno ? `${alumno.nombre} ${alumno.apellido}` : acta.id_alumno,
            dni: alumno ? alumno.dni : "",
            curso: curso ? curso.nombre_curso : "",
            tipo: acta.tipo,
            motivo: acta.motivo,
            estado: acta.estado,
            fecha: acta.fecha,
            acciones: `
                <button class="small" title="Ver acta" onclick="verActa(${acta.id_acta})">
                    ${iconoVer()}
                </button>

                <button class="small delete" title="Eliminar" onclick="eliminarRegistro('actas', ${acta.id_acta})">
                    ${iconoEliminar()}
                </button>
            `
        };
    });

    renderTablaSimple({
        titulo: "Actas",
        placeholder: "Buscar alumno DNI curso tipo motivo estado...",
        datos,
        columnas: [
            "alumno",
            "dni",
            "curso",
            "tipo",
            "motivo",
            "estado",
            "fecha",
            "acciones"
        ],
        mostrarAgregar: true,
        tablaAgregar: "actas"
    });
}

async function cargarAsistencias() {
    const { data: asistencias, error } = await supabaseClient
        .from("asistencias")
        .select("*")
        .order("fecha", { ascending: false })
        .limit(1000);

    if (error) {
        document.getElementById("resultado").innerHTML = `<p class="error">Error: ${error.message}</p>`;
        return;
    }

    const { data: alumnos } = await supabaseClient
        .from("alumnos")
        .select("id_alumno, nombre, apellido, dni");

    const resumen = {};

    asistencias.forEach(asistencia => {
        const valor = calcularValorFalta(asistencia.estado);
        if (valor <= 0) return;

        const alumno = alumnos.find(a => a.id_alumno === asistencia.id_alumno);
        const id = asistencia.id_alumno;

        if (!resumen[id]) {
            resumen[id] = {
                alumno: alumno ? `${alumno.nombre} ${alumno.apellido}` : id,
                dni: alumno ? alumno.dni : "",
                ausencias: 0,
                tardes: 0,
                total_faltas: 0
            };
        }

        const estado = String(asistencia.estado).toLowerCase();

        if (estado.includes("ausente")) {
            resumen[id].ausencias += 1;
        }

        if (estado.includes("tarde") || estado.includes("media")) {
            resumen[id].tardes += 1;
        }

        resumen[id].total_faltas += valor;
    });

    const datos = Object.values(resumen).map((fila, index) => ({
        numero: index + 1,
        alumno: fila.alumno,
        dni: fila.dni,
        ausencias: fila.ausencias,
        tardes: fila.tardes,
        total_faltas: formatearNumero(fila.total_faltas)
    }));

    renderTablaResumen({
        titulo: "Resumen de inasistencias",
        placeholder: "Buscar alumno DNI...",
        datos,
        columnas: [
            "numero",
            "alumno",
            "dni",
            "ausencias",
            "tardes",
            "total_faltas"
        ]
    });
}

function renderTablaResumen({ titulo, placeholder, datos, columnas }) {
    const resultado = document.getElementById("resultado");

    let html = `
        <div class="topbar">
            <h2>${titulo}</h2>
            <button onclick="agregarRegistro('asistencias')">Agregar</button>
        </div>

        <input class="buscador" type="text" placeholder="${placeholder}" onkeyup="filtrarTabla(this.value)">

        <div class="table-container">
            <table id="tablaDatos">
                <thead>
                    <tr>
    `;

    columnas.forEach(col => {
        html += `<th>${nombreColumna(col)}</th>`;
    });

    html += `</tr></thead><tbody>`;

    datos.forEach(fila => {
        html += "<tr>";

        columnas.forEach(col => {
            html += `<td>${fila[col] ?? ""}</td>`;
        });

        html += "</tr>";
    });

    html += "</tbody></table></div>";
    resultado.innerHTML = html;
}

function renderTablaSimple({ titulo, placeholder, datos, columnas, mostrarAgregar, tablaAgregar }) {
    const resultado = document.getElementById("resultado");

    let html = `
        <div class="topbar">
            <h2>${titulo}</h2>
            ${mostrarAgregar ? `<button onclick="agregarRegistro('${tablaAgregar}')">Agregar</button>` : ""}
        </div>

        <input class="buscador" type="text" placeholder="${placeholder}" onkeyup="filtrarTabla(this.value)">

        <div class="table-container">
            <table id="tablaDatos">
                <thead>
                    <tr>
    `;

    columnas.forEach(col => {
        if (col === "acciones") {
            html += `<th class="acciones-header"></th>`;
        } else {
            html += `<th>${nombreColumna(col)}</th>`;
        }
    });

    html += `</tr></thead><tbody>`;

    datos.forEach(fila => {
        html += "<tr>";

        columnas.forEach(col => {
            const clase =
                col === "estado" ||
                col === "estado_final" ||
                col === "estado_asistencia"
                    ? claseEstado(fila[col])
                    : "";

            if (col === "acciones") {
                html += `<td class="acciones-celda">${fila[col] ?? ""}</td>`;
            } else {
                html += `<td class="${clase}">${fila[col] ?? ""}</td>`;
            }
        });

        html += "</tr>";
    });

    html += "</tbody></table></div>";
    resultado.innerHTML = html;
}

function renderTablaEspecial({ titulo, placeholder, datos, columnas, tablaOriginal, pk }) {
    const resultado = document.getElementById("resultado");

    let html = `
        <div class="topbar">
            <h2>${titulo}</h2>
            <button onclick="agregarRegistro('${tablaOriginal}')">Agregar</button>
        </div>

        <input class="buscador" type="text" placeholder="${placeholder}" onkeyup="filtrarTabla(this.value)">

        <div class="table-container">
            <table id="tablaDatos">
                <thead>
                    <tr>
    `;

    columnas.forEach(col => {
        html += `<th>${nombreColumna(col)}</th>`;
    });

    html += `<th></th></tr></thead><tbody>`;

    datos.forEach(fila => {
        html += "<tr>";

        columnas.forEach(col => {
            const clase =
                col === "estado" ||
                col === "estado_final" ||
                col === "estado_asistencia"
                    ? claseEstado(fila[col])
                    : "";

            html += `<td class="${clase}">${fila[col] ?? ""}</td>`;
        });

        html += `
            <td class="acciones-celda">

                <button class="small edit" title="Editar" onclick="editarRegistro('${tablaOriginal}', ${fila[pk]})">
                    ${iconoEditar()}
                </button>

                <button class="small delete" title="Eliminar" onclick="eliminarRegistro('${tablaOriginal}', ${fila[pk]})">
                    ${iconoEliminar()}
                </button>

            </td>
        `;

        html += "</tr>";
    });

    html += "</tbody></table></div>";
    resultado.innerHTML = html;
}

function filtrarTabla(texto) {
    const filas = document.querySelectorAll("#tablaDatos tbody tr");
    texto = texto.toLowerCase();

    filas.forEach(fila => {
        fila.style.display = fila.innerText.toLowerCase().includes(texto) ? "" : "none";
    });
}

async function agregarRegistro(tabla) {
    if (tabla === "asistencias") {
        await agregarAsistencia();
        return;
    }

    if (tabla === "actas") {
        await agregarActa();
        return;
    }

    const c = config[tabla];
    const nuevo = {};

    for (const col of c.columnas) {
        if (col === c.pk) continue;

        const valor = prompt(`Ingrese ${nombreColumna(col)}:`);
        if (valor !== null && valor !== "") {
            nuevo[col] = valor;
        }
    }

    const { error } = await supabaseClient
        .from(tabla)
        .insert([nuevo]);

    if (error) {
        alert("Error al agregar: " + error.message);
        return;
    }

    alert("Registro agregado correctamente");
    cargarModulo(tabla);
}

async function agregarAsistencia() {
    const idAlumno = prompt("Ingrese ID del alumno:");
    if (!idAlumno) return;

    const { data: alumno, error: alumnoError } = await supabaseClient
        .from("alumnos")
        .select("id_alumno, nombre, apellido, dni")
        .eq("id_alumno", Number(idAlumno))
        .single();

    if (alumnoError || !alumno) {
        alert("No se encontró un alumno con ese ID");
        return;
    }

    const fecha = prompt("Ingrese fecha YYYY-MM-DD:");
    if (!fecha) return;

    const opcion = prompt("Tipo de inasistencia:\n1 - Ausente\n2 - Tarde\n3 - Justificada");

    let estado = "Ausente";

    if (opcion === "1") estado = "Ausente";
    if (opcion === "2") estado = "Tarde";
    if (opcion === "3") estado = "Justificada";

    const confirmar = confirm(
        `Confirmar registro:\n\nAlumno: ${alumno.nombre} ${alumno.apellido}\nDNI: ${alumno.dni}\nFecha: ${fecha}\nTipo: ${estado}`
    );

    if (!confirmar) return;

    const { error } = await supabaseClient
        .from("asistencias")
        .insert([
            {
                id_alumno: alumno.id_alumno,
                fecha: fecha,
                estado: estado
            }
        ]);

    if (error) {
        alert("Error al agregar inasistencia: " + error.message);
        return;
    }

    alert("Inasistencia agregada correctamente");
    cargarModulo("asistencias");
}

async function agregarActa() {
    const idAlumno = prompt("Ingrese ID del alumno:");
    if (!idAlumno) return;

    const { data: alumno, error: alumnoError } = await supabaseClient
        .from("alumnos")
        .select("id_alumno, nombre, apellido, dni")
        .eq("id_alumno", Number(idAlumno))
        .single();

    if (alumnoError || !alumno) {
        alert("No se encontró un alumno con ese ID");
        return;
    }

    const tipo = prompt("Tipo de acta:\nDisciplina\nNotificación\nCitación\nObservación\nFelicitación\nConducta");
    if (!tipo) return;

    const motivo = prompt("Motivo del acta:");
    if (!motivo) return;

    const descripcion = prompt("Descripción:");
    if (!descripcion) return;

    const fecha = new Date().toISOString().split("T")[0];
    const estado = "Pendiente";

    const confirmar = confirm(
        `Confirmar acta:\n\nAlumno: ${alumno.nombre} ${alumno.apellido}\nDNI: ${alumno.dni}\nFecha: ${fecha}\nTipo: ${tipo}\nMotivo: ${motivo}\nEstado: ${estado}`
    );

    if (!confirmar) return;

    const { error } = await supabaseClient
        .from("actas")
        .insert([
            {
                id_alumno: alumno.id_alumno,
                fecha: fecha,
                tipo: tipo,
                motivo: motivo,
                descripcion: descripcion,
                estado: estado
            }
        ]);

    if (error) {
        alert("Error al agregar acta: " + error.message);
        return;
    }

    alert("Acta agregada correctamente");
    cargarModulo("actas");
}

async function verActa(idActa) {
    const { data: acta, error } = await supabaseClient
        .from("actas")
        .select("*")
        .eq("id_acta", idActa)
        .single();

    if (error) {
        alert("Error al abrir acta: " + error.message);
        return;
    }

    const { data: alumno } = await supabaseClient
        .from("alumnos")
        .select("*")
        .eq("id_alumno", acta.id_alumno)
        .single();

    alert(
        `ACTA DEL ALUMNO\n\n` +
        `Alumno: ${alumno ? alumno.nombre + " " + alumno.apellido : acta.id_alumno}\n` +
        `DNI: ${alumno ? alumno.dni : ""}\n` +
        `Fecha: ${acta.fecha}\n` +
        `Tipo: ${acta.tipo}\n` +
        `Motivo: ${acta.motivo}\n` +
        `Estado: ${acta.estado}\n\n` +
        `Descripción:\n${acta.descripcion}`
    );
}

async function editarRegistro(tabla, id) {
    const c = config[tabla];

    const { data, error } = await supabaseClient
        .from(tabla)
        .select("*")
        .eq(c.pk, id)
        .single();

    if (error) {
        alert("Error al buscar registro: " + error.message);
        return;
    }

    const actualizado = {};

    for (const col of c.columnas) {
        if (col === c.pk) continue;

        const valor = prompt(`Editar ${nombreColumna(col)}:`, data[col] ?? "");

        if (valor !== null) {
            actualizado[col] = valor;
        }
    }

    const { error: updateError } = await supabaseClient
        .from(tabla)
        .update(actualizado)
        .eq(c.pk, id);

    if (updateError) {
        alert("Error al editar: " + updateError.message);
        return;
    }

    alert("Registro editado correctamente");
    cargarModulo(tabla);
}

async function eliminarRegistro(tabla, id) {
    const c = config[tabla];

    if (!confirm("¿Seguro que querés eliminar este registro?")) return;

    const { error } = await supabaseClient
        .from(tabla)
        .delete()
        .eq(c.pk, id);

    if (error) {
        alert("Error al eliminar: " + error.message);
        return;
    }

    alert("Registro eliminado correctamente");
    cargarModulo(tabla);
}

async function verAlumno(idAlumno) {
    const resultado = document.getElementById("resultado");

    const { data: alumno, error: errorAlumno } = await supabaseClient
        .from("alumnos")
        .select("*")
        .eq("id_alumno", idAlumno)
        .single();

    if (errorAlumno) {
        resultado.innerHTML = `<p class="error">Error: ${errorAlumno.message}</p>`;
        return;
    }

    const { data: inscripciones } = await supabaseClient
        .from("inscripciones")
        .select("*")
        .eq("id_alumno", idAlumno);

    const { data: cursos } = await supabaseClient
        .from("cursos")
        .select("*");

    const inscripcionesConCurso = inscripciones.map(inscripcion => {
        const curso = cursos.find(c => c.id_curso === inscripcion.id_curso);

        return {
            curso: curso ? curso.nombre_curso : inscripcion.id_curso,
            ciclo_lectivo: inscripcion.ciclo_lectivo,
            estado: inscripcion.estado,
            fecha_inscripcion: inscripcion.fecha_inscripcion
        };
    });

    const { data: notas } = await supabaseClient
        .from("notas")
        .select("*")
        .eq("id_alumno", idAlumno);

    const { data: materias } = await supabaseClient
        .from("materias")
        .select("*");

    const notasAgrupadas = {};

    notas.forEach(nota => {
        const materia = materias.find(m => m.id_materia === nota.id_materia);
        const nombreMateria = materia ? materia.nombre_materia : `Materia ${nota.id_materia}`;

        if (!notasAgrupadas[nota.id_materia]) {
            notasAgrupadas[nota.id_materia] = {
                materia: nombreMateria,
                primer_trimestre: "",
                segundo_trimestre: "",
                tercer_trimestre: "",
                nota_final: "",
                estado_final: ""
            };
        }

        if (nota.trimestre === 1) notasAgrupadas[nota.id_materia].primer_trimestre = nota.nota;
        if (nota.trimestre === 2) notasAgrupadas[nota.id_materia].segundo_trimestre = nota.nota;
        if (nota.trimestre === 3) notasAgrupadas[nota.id_materia].tercer_trimestre = nota.nota;

        if (nota.nota_final !== null && nota.nota_final !== undefined) {
            notasAgrupadas[nota.id_materia].nota_final = nota.nota_final;
        }

        if (nota.estado_final) {
            notasAgrupadas[nota.id_materia].estado_final = nota.estado_final;
        }
    });

    const boletin = Object.values(notasAgrupadas);

    const { data: cuotas } = await supabaseClient
        .from("cuotas")
        .select("*")
        .eq("id_alumno", idAlumno)
        .order("fecha_vencimiento", { ascending: true });

    const cuotasAlumno = cuotas.map(cuota => ({
        monto: cuota.monto,
        fecha_vencimiento: cuota.fecha_vencimiento,
        estado: cuota.estado
    }));

    const { data: actas } = await supabaseClient
        .from("actas")
        .select("*")
        .eq("id_alumno", idAlumno)
        .order("fecha", { ascending: false });

    const actasAlumno = actas.map(acta => ({
        fecha: acta.fecha,
        tipo: acta.tipo,
        motivo: acta.motivo,
        estado: acta.estado
    }));

    const { data: asistencias } = await supabaseClient
        .from("asistencias")
        .select("*")
        .eq("id_alumno", idAlumno)
        .order("fecha", { ascending: true });

    const resumenMensual = generarResumenMensualAsistencias(asistencias);

    const totalFaltas = resumenMensual.reduce((total, mes) => {
        return total + Number(mes.total_faltas);
    }, 0);

    const resumenGeneralInasistencias = [
        {
            total_faltas: formatearNumero(totalFaltas),
            limite: LIMITE_FALTAS,
            restantes: formatearNumero(Math.max(LIMITE_FALTAS - totalFaltas, 0)),
            estado_asistencia: calcularEstadoAsistencia(totalFaltas)
        }
    ];

    resultado.innerHTML = `
        <button class="small" onclick="cargarModulo('alumnos')">Volver</button>

        <h2>Ficha del alumno</h2>

        <section class="ficha">
            <h3>Datos personales</h3>
            <p><b>Nombre:</b> ${alumno.nombre} ${alumno.apellido}</p>
            <p><b>DNI:</b> ${alumno.dni}</p>
            <p><b>Email:</b> ${alumno.email}</p>
            <p><b>Teléfono:</b> ${alumno.telefono}</p>
            <p><b>Dirección:</b> ${alumno.direccion}</p>
            <p><b>Tutor:</b> ${alumno.tutor_a_cargo}</p>
            <p><b>Parentesco:</b> ${alumno.parentesco_tutor}</p>
        </section>

        <section class="ficha">
            <h3>Inscripción y curso</h3>
            ${crearTabla(inscripcionesConCurso)}
        </section>

        <section class="ficha">
            <h3>Boletín de notas</h3>
            ${crearTabla(boletin)}
        </section>

        <section class="ficha">
            <h3>Cuotas</h3>
            ${crearTabla(cuotasAlumno)}
        </section>

        <section class="ficha">
            <h3>Actas del alumno</h3>
            ${crearTabla(actasAlumno)}
        </section>

        <section class="ficha">
            <h3>Resumen de inasistencias</h3>
            ${crearTabla(resumenGeneralInasistencias)}
            ${crearTabla(resumenMensual)}
        </section>
    `;
}

function generarResumenMensualAsistencias(asistencias) {
    return MESES_ASISTENCIA.map(mes => {
        const registrosMes = asistencias.filter(asistencia => {
            if (!asistencia.fecha) return false;

            const fecha = new Date(asistencia.fecha + "T00:00:00");
            return fecha.getMonth() + 1 === mes.numero;
        });

        let ausencias = 0;
        let tardes = 0;
        let justificadas = 0;
        let totalFaltas = 0;

        registrosMes.forEach(registro => {
            const estado = String(registro.estado || "").toLowerCase();

            if (estado.includes("ausente")) ausencias++;
            if (estado.includes("tarde") || estado.includes("media")) tardes++;
            if (estado.includes("justificada")) justificadas++;

            totalFaltas += calcularValorFalta(registro.estado);
        });

        return {
            mes: mes.nombre,
            ausencias,
            tardes,
            justificadas,
            total_faltas: formatearNumero(totalFaltas)
        };
    });
}

async function verCurso(idCurso) {
    const resultado = document.getElementById("resultado");

    const { data: curso, error: errorCurso } = await supabaseClient
        .from("cursos")
        .select("*")
        .eq("id_curso", idCurso)
        .single();

    if (errorCurso) {
        resultado.innerHTML = `<p class="error">Error: ${errorCurso.message}</p>`;
        return;
    }

    const { data: inscripciones } = await supabaseClient
        .from("inscripciones")
        .select("*")
        .eq("id_curso", idCurso);

    const idsAlumnos = inscripciones.map(i => i.id_alumno);

    let alumnos = [];

    if (idsAlumnos.length > 0) {
        const res = await supabaseClient
            .from("alumnos")
            .select("id_alumno, nombre, apellido, dni, telefono, email, tutor_a_cargo, parentesco_tutor")
            .in("id_alumno", idsAlumnos);

        alumnos = res.data || [];
    }

    const { data: cursoMaterias } = await supabaseClient
        .from("curso_materia")
        .select("*")
        .eq("id_curso", idCurso);

    const { data: materias } = await supabaseClient
        .from("materias")
        .select("*");

    const materiasDelCurso = (cursoMaterias || []).map(cm => {
        const materia = materias.find(m => m.id_materia === cm.id_materia);

        return {
            materia: materia ? materia.nombre_materia : cm.id_materia,
            acciones: `
                <button class="small delete" title="Eliminar" onclick="quitarMateriaCurso(${cm.id_curso_materia}, ${idCurso})">
                    ${iconoEliminar()}
                </button>
            `
        };
    });

    const { data: docenteMateria } = await supabaseClient
        .from("docente_materia")
        .select("*")
        .eq("id_curso", idCurso);

    const { data: docentes } = await supabaseClient
        .from("docentes")
        .select("*");

    const docentesAsignados = (docenteMateria || []).map(dm => {
        const docente = docentes.find(d => d.id_docente === dm.id_docente);
        const materia = materias.find(m => m.id_materia === dm.id_materia);

        return {
            docente: docente ? `${docente.nombre} ${docente.apellido}` : dm.id_docente,
            materia: materia ? materia.nombre_materia : dm.id_materia,
            acciones: `
                <button class="small delete" title="Eliminar" onclick="quitarDocenteCurso(${dm.id_docente_materia}, ${idCurso})">
                    ${iconoEliminar()}
                </button>
            `
        };
    });

    const asistenciasCurso = await obtenerResumenInasistenciasCurso(alumnos);
    const notasCurso = await obtenerNotasCurso(idCurso, alumnos);

    resultado.innerHTML = `
        <button class="small" onclick="cargarModulo('cursos')">Volver</button>

        <h2>Curso ${curso.nombre_curso}</h2>

        <section class="ficha">
            <h3>Datos del curso</h3>
            ${crearTabla([curso])}
        </section>

        <section class="ficha">
            <h3>Alumnos del curso</h3>
            ${crearTabla(alumnos)}
        </section>

        <section class="ficha">
            <h3>Resumen de inasistencias del curso</h3>
            ${crearTabla(asistenciasCurso)}
        </section>

        <section class="ficha">
            <div class="topbar">
                <h3>Notas del curso</h3>
                <button class="small" onclick="agregarNotaCurso(${idCurso})">Agregar nota</button>
            </div>
            ${crearTabla(notasCurso)}
        </section>

        <section class="ficha">
            <div class="topbar">
                <h3>Materias del curso</h3>
                <button class="small" onclick="agregarMateriaCurso(${idCurso})">Agregar materia</button>
            </div>
            ${crearTablaHTML(materiasDelCurso)}
        </section>

        <section class="ficha">
            <div class="topbar">
                <h3>Docentes asignados</h3>
                <button class="small" onclick="asignarDocenteCurso(${idCurso})">Asignar docente</button>
            </div>
            ${crearTablaHTML(docentesAsignados)}
        </section>
    `;
}

async function obtenerNotasCurso(idCurso, alumnos) {
    if (!alumnos || alumnos.length === 0) return [];

    const idsAlumnos = alumnos.map(a => a.id_alumno);

    const { data: notas, error } = await supabaseClient
        .from("notas")
        .select("*")
        .in("id_alumno", idsAlumnos);

    if (error) {
        alert("Error al cargar notas del curso: " + error.message);
        return [];
    }

    const { data: materias } = await supabaseClient
        .from("materias")
        .select("*");

    const resumen = {};

    notas.forEach(nota => {
        const alumno = alumnos.find(a => a.id_alumno === nota.id_alumno);
        const materia = materias.find(m => m.id_materia === nota.id_materia);
        const clave = `${nota.id_alumno}-${nota.id_materia}`;

        if (!resumen[clave]) {
            resumen[clave] = {
                id_alumno: nota.id_alumno,
                alumno: alumno ? `${alumno.nombre} ${alumno.apellido}` : nota.id_alumno,
                materia: materia ? materia.nombre_materia : nota.id_materia,
                primer_trimestre: "",
                segundo_trimestre: "",
                tercer_trimestre: "",
                nota_final: "",
                estado_final: ""
            };
        }

        if (nota.trimestre === 1) resumen[clave].primer_trimestre = nota.nota;
        if (nota.trimestre === 2) resumen[clave].segundo_trimestre = nota.nota;
        if (nota.trimestre === 3) resumen[clave].tercer_trimestre = nota.nota;

        if (nota.nota_final !== null && nota.nota_final !== undefined) {
            resumen[clave].nota_final = nota.nota_final;
        }

        if (nota.estado_final) {
            resumen[clave].estado_final = nota.estado_final;
        }
    });

    return Object.values(resumen).sort((a, b) => {
        return a.id_alumno - b.id_alumno;
    });
}

async function agregarNotaCurso(idCurso) {
    const { data: inscripciones } = await supabaseClient
        .from("inscripciones")
        .select("*")
        .eq("id_curso", idCurso);

    const idsAlumnos = (inscripciones || []).map(i => i.id_alumno);

    if (idsAlumnos.length === 0) {
        alert("Este curso no tiene alumnos inscriptos");
        return;
    }

    const { data: alumnos } = await supabaseClient
        .from("alumnos")
        .select("id_alumno, nombre, apellido, dni")
        .in("id_alumno", idsAlumnos);

    const { data: cursoMaterias } = await supabaseClient
        .from("curso_materia")
        .select("*")
        .eq("id_curso", idCurso);

    const idsMateriasCurso = (cursoMaterias || []).map(cm => cm.id_materia);

    let materiasQuery = supabaseClient
        .from("materias")
        .select("*")
        .order("id_materia", { ascending: true });

    if (idsMateriasCurso.length > 0) {
        materiasQuery = materiasQuery.in("id_materia", idsMateriasCurso);
    }

    const { data: materias } = await materiasQuery;

    let listaAlumnos = "Alumnos del curso:\n\n";

    alumnos.forEach(a => {
        listaAlumnos += `${a.id_alumno} - ${a.nombre} ${a.apellido} - DNI ${a.dni}\n`;
    });

    const idAlumno = prompt(listaAlumnos + "\nIngrese ID del alumno:");
    if (!idAlumno) return;

    const alumnoValido = alumnos.find(a => a.id_alumno === Number(idAlumno));

    if (!alumnoValido) {
        alert("Ese alumno no pertenece a este curso");
        return;
    }

    let listaMaterias = "Materias del curso:\n\n";

    materias.forEach(m => {
        listaMaterias += `${m.id_materia} - ${m.nombre_materia}\n`;
    });

    const idMateria = prompt(listaMaterias + "\nIngrese ID de la materia:");
    if (!idMateria) return;

    const materiaValida = materias.find(m => m.id_materia === Number(idMateria));

    if (!materiaValida) {
        alert("Esa materia no pertenece a este curso");
        return;
    }

    const trimestre = Number(prompt("Ingrese trimestre: 1 2 o 3"));

    if (![1, 2, 3].includes(trimestre)) {
        alert("Trimestre inválido");
        return;
    }

    const nota = Number(prompt("Ingrese nota:"));

    if (isNaN(nota) || nota < 1 || nota > 10) {
        alert("Nota inválida. Debe ser entre 1 y 10");
        return;
    }

    const { data: notaExistente } = await supabaseClient
        .from("notas")
        .select("*")
        .eq("id_alumno", Number(idAlumno))
        .eq("id_materia", Number(idMateria))
        .eq("trimestre", trimestre)
        .maybeSingle();

    let errorOperacion;

    if (notaExistente) {
        const respuesta = confirm("Ya existe una nota para ese alumno materia y trimestre. ¿Querés reemplazarla?");

        if (!respuesta) return;

        const { error } = await supabaseClient
            .from("notas")
            .update({
                nota: nota,
                fecha: new Date().toISOString().split("T")[0]
            })
            .eq("id_nota", notaExistente.id_nota);

        errorOperacion = error;
    } else {
        const { error } = await supabaseClient
            .from("notas")
            .insert([
                {
                    id_alumno: Number(idAlumno),
                    id_materia: Number(idMateria),
                    nota: nota,
                    fecha: new Date().toISOString().split("T")[0],
                    trimestre: trimestre,
                    nota_final: null,
                    estado_final: null
                }
            ]);

        errorOperacion = error;
    }

    if (errorOperacion) {
        alert("Error al guardar nota: " + errorOperacion.message);
        return;
    }

    await recalcularNotaFinal(Number(idAlumno), Number(idMateria));

    alert("Nota guardada correctamente");
    verCurso(idCurso);
}

async function recalcularNotaFinal(idAlumno, idMateria) {
    const { data: notas } = await supabaseClient
        .from("notas")
        .select("*")
        .eq("id_alumno", idAlumno)
        .eq("id_materia", idMateria);

    const notasValidas = (notas || [])
        .filter(n => n.nota !== null && n.nota !== undefined)
        .map(n => Number(n.nota));

    if (notasValidas.length === 0) return;

    const promedio = Number(
        (notasValidas.reduce((a, b) => a + b, 0) / notasValidas.length).toFixed(2)
    );

    const estadoFinal = promedio >= 7 ? "Aprobado" : "Desaprobado";

    await supabaseClient
        .from("notas")
        .update({
            nota_final: promedio,
            estado_final: estadoFinal
        })
        .eq("id_alumno", idAlumno)
        .eq("id_materia", idMateria);
}

async function obtenerResumenInasistenciasCurso(alumnos) {
    if (!alumnos || alumnos.length === 0) return [];

    const ids = alumnos.map(a => a.id_alumno);

    const { data: asistencias } = await supabaseClient
        .from("asistencias")
        .select("*")
        .in("id_alumno", ids);

    return alumnos.map(alumno => {
        const asistenciasAlumno = (asistencias || []).filter(a => a.id_alumno === alumno.id_alumno);

        const totalFaltas = asistenciasAlumno.reduce((total, asistencia) => {
            return total + calcularValorFalta(asistencia.estado);
        }, 0);

        return {
            alumno: `${alumno.nombre} ${alumno.apellido}`,
            dni: alumno.dni,
            total_faltas: formatearNumero(totalFaltas),
            limite: LIMITE_FALTAS,
            restantes: formatearNumero(Math.max(LIMITE_FALTAS - totalFaltas, 0)),
            estado_asistencia: calcularEstadoAsistencia(totalFaltas)
        };
    });
}

async function agregarMateriaCurso(idCurso) {
    const { data: materias } = await supabaseClient
        .from("materias")
        .select("*")
        .order("id_materia", { ascending: true });

    let lista = "Materias disponibles:\n\n";

    materias.forEach(m => {
        lista += `${m.id_materia} - ${m.nombre_materia}\n`;
    });

    const idMateria = prompt(lista + "\nIngrese el ID de la materia:");
    if (!idMateria) return;

    const { error } = await supabaseClient
        .from("curso_materia")
        .insert([
            {
                id_curso: idCurso,
                id_materia: Number(idMateria)
            }
        ]);

    if (error) {
        alert("Error al agregar materia: " + error.message);
        return;
    }

    alert("Materia agregada al curso");
    verCurso(idCurso);
}

async function quitarMateriaCurso(idCursoMateria, idCurso) {
    if (!confirm("¿Seguro que querés eliminar esta materia del curso?")) return;

    const { error } = await supabaseClient
        .from("curso_materia")
        .delete()
        .eq("id_curso_materia", idCursoMateria);

    if (error) {
        alert("Error al eliminar materia: " + error.message);
        return;
    }

    alert("Materia eliminada del curso");
    verCurso(idCurso);
}

async function asignarDocenteCurso(idCurso) {
    const { data: docentes } = await supabaseClient
        .from("docentes")
        .select("*")
        .order("id_docente", { ascending: true });

    const { data: materias } = await supabaseClient
        .from("materias")
        .select("*")
        .order("id_materia", { ascending: true });

    let listaDocentes = "Docentes disponibles:\n\n";

    docentes.forEach(d => {
        listaDocentes += `${d.id_docente} - ${d.nombre} ${d.apellido}\n`;
    });

    const idDocente = prompt(listaDocentes + "\nIngrese el ID del docente:");
    if (!idDocente) return;

    let listaMaterias = "Materias disponibles:\n\n";

    materias.forEach(m => {
        listaMaterias += `${m.id_materia} - ${m.nombre_materia}\n`;
    });

    const idMateria = prompt(listaMaterias + "\nIngrese el ID de la materia:");
    if (!idMateria) return;

    const { error } = await supabaseClient
        .from("docente_materia")
        .insert([
            {
                id_docente: Number(idDocente),
                id_materia: Number(idMateria),
                id_curso: idCurso
            }
        ]);

    if (error) {
        alert("Error al asignar docente: " + error.message);
        return;
    }

    alert("Docente asignado correctamente");
    verCurso(idCurso);
}

async function quitarDocenteCurso(idDocenteMateria, idCurso) {
    if (!confirm("¿Seguro que querés eliminar este docente de la materia?")) return;

    const { error } = await supabaseClient
        .from("docente_materia")
        .delete()
        .eq("id_docente_materia", idDocenteMateria);

    if (error) {
        alert("Error al eliminar docente: " + error.message);
        return;
    }

    alert("Docente eliminado correctamente");
    verCurso(idCurso);
}

function crearTabla(data) {
    if (!data || data.length === 0) {
        return "<p>No hay datos cargados.</p>";
    }

    let html = `<div class="table-container"><table><thead><tr>`;

    Object.keys(data[0]).forEach(col => {
        html += `<th>${nombreColumna(col)}</th>`;
    });

    html += "</tr></thead><tbody>";

    data.forEach(fila => {
        html += "<tr>";

        Object.entries(fila).forEach(([key, valor]) => {
            const clase =
                key === "estado" ||
                key === "estado_final" ||
                key === "estado_asistencia"
                    ? claseEstado(valor)
                    : "";

            if (key === "acciones") {
                html += `<td class="acciones-celda">${valor ?? ""}</td>`;
            } else {
                html += `<td class="${clase}">${valor ?? ""}</td>`;
            }
        });

        html += "</tr>";
    });

    html += "</tbody></table></div>";

    return html;
}

function crearTablaHTML(data) {
    if (!data || data.length === 0) {
        return "<p>No hay datos cargados.</p>";
    }

    let html = `<div class="table-container"><table><thead><tr>`;

    Object.keys(data[0]).forEach(col => {
        if (col === "acciones") {
            html += `<th class="acciones-header"></th>`;
        } else {
            html += `<th>${nombreColumna(col)}</th>`;
        }
    });

    html += "</tr></thead><tbody>";

    data.forEach(fila => {
        html += "<tr>";

        Object.entries(fila).forEach(([key, valor]) => {
            const clase =
                key === "estado" ||
                key === "estado_final" ||
                key === "estado_asistencia"
                    ? claseEstado(valor)
                    : "";

            if (key === "acciones") {
                html += `<td class="acciones-celda">${valor ?? ""}</td>`;
            } else {
                html += `<td class="${clase}">${valor ?? ""}</td>`;
            }
        });

        html += "</tr>";
    });

    html += "</tbody></table></div>";

    return html;
}

window.toggleMenu = function () {
    const layout = document.querySelector(".layout");
    layout.classList.toggle("menu-oculto");
};

cargarDashboard();