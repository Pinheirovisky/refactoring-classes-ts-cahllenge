import { useEffect, useState } from "react";

import api from "services/api";

// components:
import { Food, Header, ModalAddFood, ModalEditFood } from "components";

// models:
import { ItemFood } from "components/Food";

// styles:
import { FoodsContainer } from "./styles";

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<ItemFood[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<ItemFood>({} as ItemFood);

  useEffect(() => {
    const fetchFoods = async () => {
      const response = await api.get("/foods");

      setFoods(response.data);
    };

    fetchFoods();
  }, []);

  const handleAddFood = async (food: ItemFood) => {
    try {
      const response = await api.post("/foods", {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateFood = async (food: ItemFood) => {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFood = async (id: string) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);

    setFoods(foodsFiltered);
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };

  const handleEditFood = (food: ItemFood) => {
    setEditingFood(food);
    setEditModalOpen(true);
  };

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
