In Crust you can do pretty much whatever you want regarding rendering of menus. You get the entire source structure for each page on each compile, so you can traverse it an present it however you want.

Inside the ```app/templates/components/menu.html``` we just render out a pile of ```<li>```s to put into our outer containers. The content of the menu file is as follows:


```
{% macro renderMenu(menuStructure) %}
  <li {% if path == menuStructure.path %} class="active"{% endif %}>
      <a href="/{{menuStructure.path}}/">{{menuStructure.name}}</a>
  </li>
{% endmacro %}


{% for menu in structure %}
  {{ renderMenu(menu) }}
  {% for child in menu.children %}
    {% if child.parent == path %}
      {{ renderMenu(child) }}
    {% endif %}
  {% endfor %}
{% endfor %}
```

But you can do your own implementations however you want.