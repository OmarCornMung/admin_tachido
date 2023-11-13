<template>
  <v-data-table
    :headers="headers"
    :items="products"
    :sort-by="[{ key: 'calories', order: 'asc' }]"
    class="elevation-1"
  >
    <template #item.imageUrl="{ item }">
      <img
        :src="item.imageUrl[0]"
        alt="thumbnail"
        style="width: 50px; height: 50px"
      />
    </template>
    <template #item.sizes="{ item }">
      <span v-for="(size, index) in item.sizes" :key="index">
        {{ size.size }}{{ index < item.sizes.length - 1 ? ", " : "" }}
      </span>
    </template>
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>
          Mis Productos
          <v-icon icon="fa:fas fa-shirt"></v-icon>
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="1000px">
          <template v-slot:activator="{ props }">
            <v-btn color="primary" dark class="mb-2" v-bind="props"
              >Nuevo Producto</v-btn
            >
          </template>

          <v-card class="p-4">
            <v-card-title class="text-lg font-bold mb-4">{{
              formTitle
            }}</v-card-title>

            <v-card-text>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <v-text-field
                    v-model="editedItem.title"
                    label="Titulo Producto"
                  ></v-text-field>
                </div>
                <div>
                  <v-text-field
                    v-model="editedItem.name"
                    label="Nombre"
                  ></v-text-field>
                </div>

                <div>
                  <v-autocomplete
                    v-model="editedItem.category"
                    label="Categoría"
                    :items="['Hombres', 'Mujeres', 'Niños', 'Accesorios']"
                  ></v-autocomplete>
                </div>

                <div>
                  <v-file-input
                    v-model="imageUrl"
                    label="Imagen"
                    show-size
                    counter
                    multiple
                    accept="image/*"
                  ></v-file-input>
                </div>

                <div>
                  <v-subheader>Tallas</v-subheader>
                  <v-checkbox
                    v-model="editedItem.sizes.CH"
                    label="CH"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="editedItem.sizes.M"
                    label="M"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="editedItem.sizes.G"
                    label="G"
                  ></v-checkbox>
                </div>
                <div>
                  <v-text-field
                    v-model="editedItem.oldPrice"
                    label="Precio de Compra"
                    type="text"
                    :rules="priceRules"
                    @input="formatPrice"
                  ></v-text-field>
                </div>
                <div>
                  <v-text-field
                    v-model="editedItem.price"
                    label="Precio"
                    type="text"
                    :rules="priceRules"
                    @input="formatPrice"
                  ></v-text-field>
                </div>

                <div class="col-span-2">
                  <v-textarea
                    no-resize
                    v-model="editedItem.description"
                    label="Descripción"
                  ></v-textarea>
                </div>
              </div>
            </v-card-text>

            <v-card-actions class="mt-6 flex justify-end">
              <v-btn color="blue darken-1" class="mr-4" @click="close"
                >Cancelar</v-btn
              >
              <v-btn color="blue darken-1" @click="save">Guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >¿Estás seguro de que quieres borrar este elemento?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete"
                >Cancelar</v-btn
              >
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon size="small" class="me-2" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
  </v-data-table>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useProductStore } from "@/store/products";
import { useGlobalProgressStore } from "@/store/globalProgress";
import { storeToRefs } from "pinia";

const { products } = storeToRefs(useProductStore());
const dialog = ref(false);
const dialogDelete = ref(false);

const headers = [
  {
    title: "Nombre",
    align: "start",
    key: "name",
  },
  { title: "Categoria", key: "category" },
  { title: "Imagen", key: "imageUrl" },
  { title: "Tallas", key: "sizes" },
  { title: "Precio", key: "price" },
  { title: "Descripción", key: "description" },
  { title: "Acciones", key: "actions", sortable: false },
];

const editedIndex = ref(-1);

const imageUrl = ref([]);

const editedItem = ref({
  name: "",
  title: "",
  category: "",
  sizes: {
    CH: false,
    M: false,
    G: false,
  },
  oldPrice: 0,
  price: 0,
  description: "",
});

const defaultItem = {
  name: "",
  title: "",
  category: "",
  sizes: [],
  price: 0,
  oldPrice: 0,
  description: "",
};

const formTitle = computed(() => {
  return editedIndex.value === -1 ? "Nuevo Producto" : "Editar Producto";
});

const editItem = (item) => {
  editedIndex.value = products.value.indexOf(item);
  editedItem.value = { ...item };
  dialog.value = true;
};

const deleteItem = (item) => {
  editedIndex.value = item._id;
  dialogDelete.value = true;
};

const deleteItemConfirm = async () => {
  try {
    console.log(editedIndex.value);
    await useProductStore().deleteProduct(editedIndex.value)
    closeDelete();
  } catch (error) {
    console.log(error);
    throw new Error
  }
};

const close = () => {
  dialog.value = false;
  editedItem.value = { ...defaultItem };
  editedIndex.value = -1;
};

const closeDelete = () => {
  dialogDelete.value = false;
  editedItem.value = { ...defaultItem };
  editedIndex.value = -1;
};

const save = async () => {
  const formData = new FormData();
  formData.append("name", editedItem.value.name);
  formData.append("title", editedItem.value.title);
  formData.append("category", editedItem.value.category);
  formData.append("price", editedItem.value.price);
  formData.append("oldPrice", editedItem.value.oldPrice);
  formData.append("description", editedItem.value.description);

  for (const file of imageUrl.value) {
    formData.append("imageUrl", file);
  }

  let index = 0;
  Object.keys(editedItem.value.sizes).forEach((key) => {
    if (editedItem.value.sizes[key]) {
      formData.append(`sizes[${index}][size]`, key);
      index++;
    }
  });
  try {
    useGlobalProgressStore().show();
    const response = await useProductStore().createProduct(formData);
    if (response.status === 200) {
      useProductStore().getProducts();
    } else {
      alert.value.show = true;
      alert.value.message = response.data;
    }
    
    dialog.value = false;
    editedItem.value = { ...defaultItem };
    useGlobalProgressStore().hide();
  } catch (error) {
    console.error(error);
  }
};

// Reglas para el campo de precio
const priceRules = [
  (v) => !!v || "¡El precio es requerido!",
  (v) => /^\d+(\.\d{1,2})?$/.test(v) || "¡Formato de precio inválido!",
];

// Formatear el precio en formato de pesos mexicanos
const formatPrice = () => {
  if (editedItem.value.price !== "" && editedItem.value.oldPrice !== "") {
    let value = editedItem.value.price.toString().replace(/\D/g, "");
    value = value.replace(/^0+/, "");
    if (value.length === 0) {
      value = "0";
    } else if (value.length === 1) {
      value = `0.0${value}`;
    } else if (value.length === 2) {
      value = `0.${value}`;
    } else {
      value = `${value.slice(0, -2)}.${value.slice(-2)}`;
    }
    editedItem.value.price = value;
    editedItem.value.price = value;
  }
};

onMounted(async () => {
  await useProductStore().getProducts();
});
</script>
