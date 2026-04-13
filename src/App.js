import React, { useEffect, useState } from "react";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [tarefas, setTarefas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [concluido, setConcluido] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    carregarTarefas();
  }, []);

  const carregarTarefas = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tarefas`);
      const data = await response.json();

      console.log("Resposta da API:", data);

      if (Array.isArray(data)) {
        setTarefas(data);
      } else {
        console.error("A API não retornou um array:", data);
        setTarefas([]);
      }
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
      setTarefas([]);
    }
  };

  const limparFormulario = () => {
    setTitulo("");
    setDescricao("");
    setConcluido(false);
    setEditandoId(null);
  };

  const salvarTarefa = async (e) => {
    e.preventDefault();

    if (!titulo.trim() || !descricao.trim()) {
      alert("Preencha título e descrição.");
      return;
    }

    const payload = {
      titulo,
      descricao,
      concluido,
    };

    try {
      if (editandoId) {
        await fetch(`${API_URL}/${editandoId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      limparFormulario();
      carregarTarefas();
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
    }
  };

  const editarTarefa = (tarefa) => {
    setTitulo(tarefa.titulo);
    setDescricao(tarefa.descricao);
    setConcluido(tarefa.concluido);
    setEditandoId(tarefa.id);
  };

  const excluirTarefa = async (id) => {
    const confirmar = window.confirm("Deseja realmente excluir esta tarefa?");
    if (!confirmar) return;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      carregarTarefas();
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
    }
  };

  return (
    <div className="container">
      <h1>CRUD de Tarefas</h1>

      <form className="formulario" onSubmit={salvarTarefa}>
        <h2>{editandoId ? "Editar Tarefa" : "Nova Tarefa"}</h2>

        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <textarea
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <label className="checkbox">
          <input
            type="checkbox"
            checked={concluido}
            onChange={(e) => setConcluido(e.target.checked)}
          />
          Concluído
        </label>

        <div className="botoes-form">
          <button type="submit">
            {editandoId ? "Atualizar" : "Adicionar"}
          </button>
          <button type="button" className="cancelar" onClick={limparFormulario}>
            Cancelar
          </button>
        </div>
      </form>

      <div className="lista">
        <h2>Lista de Tarefas</h2>
        
        {Array.isArray(tarefas) && tarefas.length > 0 ? (
          tarefas.map((tarefa) => (
            <div className="card-tarefa" key={tarefa.id}>
              <h3>{tarefa.titulo}</h3>
              <p><strong>ID:</strong> {tarefa.id}</p>
              <p><strong>Descrição:</strong> {tarefa.descricao}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={tarefa.concluido ? "concluida" : "pendente"}>
                  {tarefa.concluido ? "Concluída" : "Pendente"}
                </span>
              </p>

              <div className="acoes">
                <button onClick={() => editarTarefa(tarefa)}>Editar</button>
                <button
                  className="excluir"
                  onClick={() => excluirTarefa(tarefa.id)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Nenhuma tarefa cadastrada.</p>
        )}
      </div>
    </div>
  );
}

export default App;