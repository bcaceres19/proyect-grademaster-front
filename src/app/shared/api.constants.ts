export class ApiHttpConstants{

    //BASE
    public static readonly API_BASE = "http://localhost:";
    public static readonly API_BASE_CLOUDINARY = "https://api.cloudinary.com"

    //PUERTOS
    public static readonly PORT_ADMINISTRATIVO = "8002";
    public static readonly PORT_ESTUDIANTE = "8003";
    public static readonly PORT_DOCENTE = "8004"

    //CONEXION-MICROSERVICIO
    public static readonly URL_ADMINISTRATIVO = "/administrativo/api/v1";
    public static readonly API_CLOUDINARY = "/v1_1";
    public static readonly URL_ESTUDIANTE = "/estudiante/api/v1";
    public static readonly URL_DOCENTE = "/docente/api/v1"

    //CONTROLADORES
    public static readonly LOGIN = "/login"
    public static readonly CARRERAS = "/carreras"
    public static readonly ESTADOS = "/estados";
    public static readonly GENEROS = "/generos";
    public static readonly CLOUD_NAME = "/dduffgima";
    public static readonly MATERIAS = "/materias";
    public static readonly SEMESTRE = "/semestre";
    public static readonly NOTAS_DOCENTE = "/notasDocente";

    //SERVICIO
    public static readonly UPLOAD_IMAGE = "/upload";
    public static readonly CREAR_ESTUDIANTE = "/crear";
    public static readonly ALL_CARRERAS = "/all-carreras";
    public static readonly ALL_ESTADOS = "/all";
    public static readonly ALL_GENEROS = "/all";
    public static readonly ALL_MATERIAS = "/all";
    public static readonly ALL_MATERIAS_DOCENTES = "/allMateriasDocente";
    public static readonly ALL_DOCENTES_ACTIVOS = "/allDocentesActivos";
    public static readonly GENERAR_CORREO = "/correo";
    public static readonly GENERAR_CODIGO = "/codigo";
    public static readonly CREAR_DOCENTE = "/crear"
    public static readonly CREAR_CARRERA = "/crear"
    public static readonly ULTIMO_SEMESTRE = "/ultimo"
    public static readonly SEMESTRE_VENCIDO = "/semestre-vencido"
    public static readonly ASIGNAR_MATERIAS = "/asignarMaterias"
    public static readonly MATERIAS_ASIGNADAS_DOCENTE = "/materiasAsignadasDocente"
    public static readonly ESTUDIANTES_DOCENTE = "/allEstudiantesPorMateria"
    public static readonly GENERAR_CODIGO_NOTA = "/generarCodigo"
    public static readonly VERIFICAR_EXISTENCIA_NOTAS = "/existenciaNotasDocente"
    public static readonly CREAR_NOTAS = "/crearNotas"
    public static readonly ALL_NOTAS_MATERIA_DOCENTE = "/allNotasMateriaDocente"
    public static readonly CONSEGUIR_NOTA_ESTUDIANTE = "/conseguirNotaEstudiante"
    public static readonly CREAR_NOTAS_ESTUDIANTE = "/crearNotasEstudiante"



}